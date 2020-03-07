import React, { useState, useEffect } from 'react'
import { Loader, Divider } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Job from './Job'

import ModalJobForm from './ModalJobForm'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'
import { Auth } from 'aws-amplify'
import Lambda from 'aws-sdk/clients/lambda'
//const hashify = require('../util').hashify
//const stripToAlphaNum = require('../util').stripToAlphaNum
const utility = require('../utility')

/////
const getCredentials = async event => {
  const currCred = await Auth.currentCredentials()
  const cred = Auth.essentialCredentials(currCred)
  //TODO put region someplace else
  cred.region = 'us-east-2'
  return cred
}

const lambdaInvoke = async event => {
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

/////

const loadingSpin = (event, spin) => {
  event.preventDefault()
  event.persist()
  if (spin) {
    event.target.className += ' loading'
  } else {
    event.target.className = event.target.className.replace(/ loading/g, '')
  }
}

const formJobToDB = data => {
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

const deserializeJobs = data => {
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

const handleJobCreate = async data => {
  try {
    const job = formJobToDB(data)
    await API.graphql(graphqlOperation(mutations.createJob, { job: job }))
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
      const pairs = allNotes.data.listNotesByPKey.map(o => {
        return { id: o.id, rk: o.rk }
      })
      await API.graphql(
        graphqlOperation(mutations.batchDeleteNotes, { pairs: pairs })
      )
    }
    loadingSpin(event, false)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const handleEnqueue = async (event, job) => {
  try {
    loadingSpin(event, true)
    const cred = await getCredentials()
    console.log(cred)

    let x = utility.ggxDBConn({ host: 'TODO', repo: job.repo })
    console.log(x)

    //1 remove DBConnect from stackery
    //2. do a lambda

    console.log(job)
    for (const o of job.assets) {
      console.log(job.app, o.asset, o.filter)
      let payload = await lambdaInvoke({
        cred: cred,
        name: 'purrio-dev-Enqueue',
        args: {
          attr_app: job.app,
          attr_target: 'database',
          attr_directive: 'batcher',
          asset: o.asset,
          label: job.label,
          id: job.id
        }
      })
      console.log(payload)
    }

    loadingSpin(event, false)
  } catch (error) {
    console.error(error)
  }
}

const emptyJob = app => {
  const job = {
    app: app.toUpperCase(),
    repo: '',
    label: '',
    assets: [{ asset: '', filter: '' }]
  }
  return attachJobHandlers(job)
}

const attachJobHandlers = job => {
  const handlers = {
    handleJobCreate: handleJobCreate,
    handleJobDelete: handleJobDelete,
    handleNotesDelete: handleNotesDelete,
    handleEnqueue: handleEnqueue
  }
  return Object.assign(job, handlers)
}
///////////////////////////////////////////////////////////////////////////////
const JobList = props => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchJobs = async app => {
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

  useEffect(() => {
    fetchJobs(props.app)
  }, [props.app])

  useEffect(() => {
    try {
      const subscription = API.graphql(
        graphqlOperation(subscriptions.onCreateJob)
      ).subscribe({
        next: res => {
          const createdJob = res.value.data.onCreateJob
          const job = deserializeJobs([createdJob]) //assumes input is an array
          const updatedJobs = jobs.concat(job)
          setJobs(updatedJobs)
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [jobs])

  useEffect(() => {
    try {
      const subscription = API.graphql(
        graphqlOperation(subscriptions.onDeleteJob)
      ).subscribe({
        next: res => {
          const deletedJob = res.value.data.onDeleteJob

          const fewerJobs = jobs.filter(
            job => job.id !== deletedJob.id && job.rk !== deletedJob.rk
          )
          setJobs(fewerJobs)
        }
      })
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [jobs])

  return isLoading ? (
    <Loader active={true} size="massive" />
  ) : (
    <div>
      {jobs.map(job => (
        <Job key={job.id} job={job} />
      ))}
      <Divider />
      <ModalJobForm job={emptyJob(props.app)} />
    </div>
  )
}

export default JobList
