import React, { useState, useEffect } from 'react'
import { Loader, Divider } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Job from './Job'

import ModalJobForm from './ModalJobForm'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'

const hashify = require('../util').hashify
const stripToAlphaNum = require('../util').stripToAlphaNum

const formJobToDB = data => {
  const job = {
    id: hashify(`${data.app}_${data.repo}_${data.label}`),
    rk: stripToAlphaNum(data.repo),
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
    jobs.push({
      id: o.id,
      app: o.app,
      assets: JSON.parse(o.assets),
      aux: o.aux,
      label: o.label,
      repo: o.repo,
      handleJobCreate: handleJobCreate,
      handleJobDelete: handleJobDelete,
      handleNotesDelete: handleNotesDelete
    })
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

const handleJobDelete = async job => {
  try {
    const pair = { id: job.id, rk: stripToAlphaNum(job.repo) }
    await API.graphql(graphqlOperation(mutations.deleteJob, { pair: pair }))
    await handleNotesDelete(job)
  } catch (error) {
    console.error(error)
  }
}

const handleNotesDelete = async job => {
  try {
    let allNotes = await API.graphql(
      graphqlOperation(queries.listNotesByPKey, { id: job.id })
    )
    const pairs = allNotes.data.listNotesByPKey.map(o => {
      return { id: o.id, rk: o.rk }
    })
    await API.graphql(
      graphqlOperation(mutations.batchDeleteNotes, { pairs: pairs })
    )
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

///////////////////////////////////////////////////////////////////////////////
const JobList = props => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const emptyJob = {
    app: props.app.toUpperCase(),
    repo: '',
    label: '',
    assets: [{ asset: '', filter: '' }],
    handleJobCreate: handleJobCreate,
    handleJobDelete: handleJobDelete,
    handleNotesDelete: handleNotesDelete
  }

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
    <Loader>loading</Loader>
  ) : (
    <div>
      {jobs.map(job => (
        <Job key={job.id} job={job} />
      ))}
      <Divider />
      <ModalJobForm job={emptyJob} />
    </div>
  )
}

export default JobList
