import React, { useState, useEffect } from 'react'
import { Loader, Divider } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Job from './Job'

import ModalJobForm from './ModalJobForm'

const hashify = require('../util').hashify
const stripToAlphaNum = require('../util').stripToAlphaNum

///////////////////////////////////////////////////////////////////////////////
const listJobsByApp = `query ListJobsByApp($app: App) {
  listJobsByApp(app: $app){
    id
    rk
    app
    assets
    aux
    label
    repo
    modified
  }
}`

const createJob = `mutation CreateJob($job: JobInput) {
  createJob(job: $job) {
    id
    rk
    app
    assets
    aux
    label
    repo
  }
}`

const deleteJob = `mutation DeleteJob($pair: KeyPair) {
  deleteJob(pair: $pair) {
    id
    rk
  }
}`

const onCreateJob = `subscription OnCreateJob {
  onCreateJob{
    id
    rk
    app
    assets
    aux
    label
    repo
  }
}`

const onDeleteJob = `subscription OnDeleteJob {
  onDeleteJob{
    id
    rk
  }
}`

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
      handleFormSubmit: handleFormSubmit,
      handleJobDelete: handleJobDelete
    })
  }
  return jobs
}

const handleFormSubmit = async data => {
  try {
    const job = formJobToDB(data)
    await API.graphql(graphqlOperation(createJob, { job: job }))
  } catch (error) {
    console.error(error)
  }
}

const handleJobDelete = async data => {
  try {
    const pair = { id: data.id, rk: stripToAlphaNum(data.repo) }
    await API.graphql(graphqlOperation(deleteJob, { pair: pair }))
  } catch (error) {
    console.error(error)
  }
}

///////////////////////////////////////////////////////////////////////////////
const JobList = props => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const emptyJob = {
    app: props.app.toUpperCase(),
    repo: '',
    label: '',
    assets: [{ asset: '', filter: '' }],
    handleFormSubmit: handleFormSubmit,
    handleJobDelete: handleJobDelete
  }

  const fetchJobs = async app => {
    setIsLoading(true)

    try {
      const dbJobs = await API.graphql(
        graphqlOperation(listJobsByApp, { app: app.toUpperCase() })
      )
      let jobz = deserializeJobs(dbJobs.data.listJobsByApp)

      setJobs(jobz)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchJobs(props.app)
  }, [props.app])

  ///
  useEffect(() => {
    try {
      const subscription = API.graphql(graphqlOperation(onCreateJob)).subscribe(
        {
          next: res => {
            console.log('__________onCreateJob')
            const createdJob = res.value.data.onCreateJob
            const j = deserializeJobs([createdJob]) //assumes input is an array
            const updatedJobs = jobs.concat(j)
            setJobs(updatedJobs)
          }
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [jobs])

  useEffect(() => {
    try {
      const subscription = API.graphql(graphqlOperation(onDeleteJob)).subscribe(
        {
          next: res => {
            console.log('__________onDeleteJob')
            const deletedJob = res.value.data.onDeleteJob

            const fewerJobs = jobs.filter(
              job => job.id !== deletedJob.id && job.rk !== deletedJob.rk
            )
            setJobs(fewerJobs)
          }
        }
      )
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [jobs])
  ///

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
