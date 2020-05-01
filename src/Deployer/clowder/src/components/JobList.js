import React, { useState, useEffect } from 'react'
import { Loader, Divider } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import JobBox from './JobBox'
import ModalJobForm from './ModalJobForm'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'
import { Auth } from 'aws-amplify'
import Lambda from 'aws-sdk/clients/lambda'
import pcfg from '../purr-cfg'
import { WorkerStore } from './WorkerContext'
const utility = require('../utility')

////////////////////////////////////////////////////////////////////////////////

const getCredentials = async (event) => {
  const currCred = await Auth.currentCredentials()
  const cred = Auth.essentialCredentials(currCred)
  //TODO store region someplace else
  cred.region = 'us-east-2'
  return cred
}

const lambdaInvoke = async (event) => {
  const { cred, name, args } = event
  const lamb = new Lambda(cred)
  let params = {
    FunctionName: name,
    Payload: JSON.stringify(args)
  }
  try {
    let res = await lamb.invoke(params).promise()
    let payload = JSON.parse(res.Payload)
    payload.lambda = name
    return payload
  } catch (error) {
    console.error(error)
  }
}

const loadingSpin = (event, spin) => {
  event.preventDefault()
  event.persist()
  if (spin) {
    event.target.className += ' loading'
  } else {
    event.target.className = event.target.className.replace(/ loading/g, '')
  }
}

const formJobToDB = (data) => {
  const job = {
    id: utility.hashify(`${data.app}_${data.repo}_${data.label}`),
    rk: utility.stripToAlphaNum(data.repo),
    app: data.app,
    assets: JSON.stringify(data.assets) || null,
    aux: data.aux || null,
    label: data.label || 'unlabeled',
    repo: data.repo
  }
  return job
}

const deserializeJobs = (data) => {
  const jobs = []
  for (const o of data) {
    const job = {
      id: o.id,
      app: o.app,
      assets: JSON.parse(o.assets),
      aux: o.aux,
      label: o.label,
      repo: o.repo
    }
    jobs.push(attachJobHandlers(job))
  }
  return jobs
}

const handleJobCreate = async (data) => {
  try {
    const job = formJobToDB(data)
    const x = await API.graphql(
      graphqlOperation(mutations.createJob, { job: job })
    )
    return attachJobHandlers(x.data.updateJob)
  } catch (error) {
    console.error(error)
  }
}

const handleJobUpdate = async (data) => {
  try {
    const job = formJobToDB(data)
    const x = await API.graphql(
      graphqlOperation(mutations.updateJob, { job: job })
    )
    return attachJobHandlers(x.data.updateJob)
  } catch (error) {
    console.error(error)
  }
}

const handleJobDelete = async (event, job) => {
  try {
    loadingSpin(event, true)
    const pair = { id: job.id, rk: utility.stripToAlphaNum(job.repo) }
    await API.graphql(graphqlOperation(mutations.deleteJob, { pair: pair }))
    await handleNotesDelete(event, job)
    loadingSpin(event, false)
  } catch (error) {
    console.error(error)
  }
}

const handleNotesDelete = async (event, job) => {
  try {
    loadingSpin(event, true)
    let allNotes = await API.graphql(
      graphqlOperation(queries.listNotesByPKey, { id: job.id })
    )
    if (allNotes.data.listNotesByPKey.length > 0) {
      const pairs = allNotes.data.listNotesByPKey.map((o) => {
        return { id: o.id, rk: o.rk }
      })

      // DynamoDB batch delete is limited to chunks of 25, may need a refactor?
      const doomed = []
      for (let i = 0; i < pairs.length; i += 25) {
        let discards = pairs.slice(i, i + 25)
        doomed.push(
          API.graphql(
            graphqlOperation(mutations.batchDeleteNotes, { pairs: discards })
          )
        )
      }
      await Promise.all(doomed)
      loadingSpin(event, false)
      return true
    }
    loadingSpin(event, false)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const handleWorkerPing = async (event, job) => {
  try {
    loadingSpin(event, true)

    const enqueueLambda = utility.enqueueLambdaName()
    const cred = await getCredentials()

    await lambdaInvoke({
      cred: cred,
      name: enqueueLambda,
      args: {
        a_purr_org: pcfg.purr_org,
        a_purr_env: pcfg.purr_env,
        r_app: 'ping',
        m_job_id: job.id
      }
    })

    loadingSpin(event, false)
  } catch (error) {
    console.error(error)
  }
}

const handleEnqueue = async (event, job) => {
  try {
    loadingSpin(event, true)

    const batcherLambda = utility.batcherLambdaName()
    const enqueueLambda = utility.enqueueLambdaName()
    const cred = await getCredentials()

    //TODO: choose conn by app
    //TODO: figure out how to route filesystem-based stuff

    const conn = utility.ggxDBConn({ aux: job.aux, repo: job.repo })

    for (const o of job.assets) {
      const assetLambda = utility.assetLambdaName(job.app, o.asset)

      let assetQ = await lambdaInvoke({
        cred: cred,
        name: assetLambda,
        args: { q_filter: o.filter }
      })
      //console.log(assetQ)

      // a: attributes of this SQS message (usage tbd)
      // r: routing info for worker
      // f: lambda function names so that the worker needn't look them up
      // m: metadata about the job
      // q: stuff involving queries worker will use

      await lambdaInvoke({
        cred: cred,
        name: enqueueLambda,
        args: {
          a_purr_org: pcfg.purr_org,
          a_purr_env: pcfg.purr_env,

          r_app: job.app,
          r_target: 'database',
          r_directive: 'batcher',

          f_asset: assetLambda,
          f_batcher: batcherLambda,
          f_enqueue: enqueueLambda,

          m_label: job.label,
          m_job_id: job.id,
          m_asset: o.asset,
          m_purr_org: pcfg.purr_org,
          m_purr_env: pcfg.purr_env,

          q_chunk: assetQ.chunk,
          q_counter: assetQ.counter,
          q_filter: job.filter,
          q_selector: assetQ.selector,
          q_conn: conn
        }
      })
    }

    loadingSpin(event, false)
  } catch (error) {
    console.error(error)
  }
}

const emptyJob = (app) => {
  const job = {
    app: app.toUpperCase(),
    repo: '',
    label: '',
    assets: [{ asset: '', filter: '' }]
  }
  return attachJobHandlers(job)
}

const attachJobHandlers = (job) => {
  const handlers = {
    handleJobCreate: handleJobCreate,
    handleJobUpdate: handleJobUpdate,
    handleJobDelete: handleJobDelete,
    handleNotesDelete: handleNotesDelete,
    handleEnqueue: handleEnqueue,
    handleWorkerPing: handleWorkerPing
  }
  return Object.assign(job, handlers)
}

////////////////////////////////////////////////////////////////////////////////

const JobList = (props) => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { dispatch } = WorkerStore()

  useEffect(() => {
    const fetchJobs = async (app) => {
      setIsLoading(true)

      try {
        const dbJobs = await API.graphql(
          graphqlOperation(queries.listJobsByApp, { app: app.toUpperCase() })
        )
        setJobs(deserializeJobs(dbJobs.data.listJobsByApp))
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
    fetchJobs(props.app)
  }, [props.app])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateJob)
    ).subscribe({
      next: (res) => {
        const createdJob = res.value.data.onCreateJob
        const job = deserializeJobs([createdJob]) // input is an array
        const refresh = jobs.concat(job)
        setJobs(refresh)
      }
    })
    return () => subscription.unsubscribe()
  })

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateJob)
    ).subscribe({
      next: (res) => {
        // job.id is based on "app + repo + label", so if any of those fields
        // changed this should get processed as a Create, not an Update

        const updatedJob = res.value.data.onUpdateJob
        const job = deserializeJobs([updatedJob])[0]

        /*
        // functional update has no relevant difference
        setJobs((jobs) => {
          const idExists = jobs.map((j) => j.id).includes(job.id)
          if (idExists) {
            const refresh = jobs.map((j) => {
              return j.id === job.id ? job : j
            })
            return refresh
          } else {
            return [...jobs, job]
          }
        })
        */

        let idExists = jobs.map((j) => j.id).includes(job.id)

        if (idExists) {
          const refresh = jobs.map((j) => {
            return j.id === job.id ? job : j
          })
          setJobs(refresh)
        } else {
          setJobs((jobs) => [...jobs, job])
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [jobs])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onDeleteJob)
    ).subscribe({
      next: (res) => {
        const deletedJob = res.value.data.onDeleteJob
        const refresh = jobs.filter(
          (job) => job.id !== deletedJob.id && job.rk !== deletedJob.rk
        )
        setJobs(refresh)
      }
    })
    return () => subscription.unsubscribe()
  })

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateNote)
    ).subscribe({
      next: (res) => {
        const createdNote = res.value.data.onCreateNote
        const cargo = JSON.parse(createdNote.cargo)
        if (cargo.action && cargo.action === 'set_counts') {
          dispatch({
            id: createdNote.id,
            type: 'increment',
            batchCount: cargo.batch_count,
            itemCount: cargo.item_count
          })
        } else if (cargo.action && cargo.action === 'decrement') {
          dispatch({
            id: createdNote.id,
            type: 'decrement',
            batchCount: 1,
            itemCount: cargo.item_count
          })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [dispatch])

  return isLoading ? (
    <Loader active={true} size="massive" />
  ) : (
    <div>
      {jobs.map((job) => (
        <JobBox key={job.id} job={job} />
      ))}
      <Divider />
      <ModalJobForm job={emptyJob(props.app)} />
    </div>
  )
}

export default JobList
