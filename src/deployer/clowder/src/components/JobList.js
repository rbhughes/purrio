import React, { useState, useEffect } from 'react'
import { Loader } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Job from './Job'

import ModalJobForm from './ModalJobForm'

const Crypto = require('crypto')

// ignores case on Windows
const hashify = s => {
  //console.log('HASHIFY: ' + s)
  const hash = Crypto.createHash('md5')
  hash.update(s.toLowerCase())
  return hash.digest('hex')
}

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
  }
}`

const putJob = `mutation PutJob($job: JobInput) {
  putJob(job: $job) {
    id
    rk
  }
}`

const batchDeleteJobs = `mutation BatchDeleteJobs($pairs: [JobKeyPair]) {
  batchDeleteJobs(pairs: $pairs) {
    id
    rk
  }
}`

/*
const batchPutJobs = `mutation BatchPutJobs($jobs: [JobInput]) {
  batchPutJobs(jobs: $jobs) {
    id
    rk
  }
}`
*/

/*
const onPutJobs = `subscription OnPutJobs {
  onPutJobs {
    id
    rk
    repo
  }
}`
*/

const formJobToDB = data => {
  const job = {
    id: hashify(`${data.app}_${data.repo}_${data.label}`),
    rk: data.repo.toLowerCase(),
    app: data.app,
    assets: JSON.stringify(data.assets) || null,
    aux: data.aux || null,
    label: data.label || 'unlabeled',
    repo: data.repo
  }
  return job
}

//TODO rename
const dbToList = data => {
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
  console.log('-----handleFormSubmit-------')
  try {
    const job = formJobToDB(data)
    await API.graphql(graphqlOperation(putJob, { job: job }))
  } catch (error) {
    console.error(error)
  }
}

const handleJobDelete = async data => {
  console.log('---------handleJobDelete--------')
  try {
    const pairs = []
    for (const a of data.assets) {
      pairs.push({ id: data.id, rk: `${a.asset}_${hashify(a.filter)}` })
    }
    let res = await API.graphql(
      graphqlOperation(batchDeleteJobs, { pairs: pairs })
    )
  } catch (error) {
    console.error(error)
  }
}

// kinda like a GROUP BY asset+filter
/*
const formatClumpToJobs = data => {
  const jobs = []
  for (const a of data.assets) {
    jobs.push({
      app: data.app,
      id: hashify(`${data.app}_${data.repo}_${data.label}`),
      rk: `${a.asset}_${hashify(a.filter)}`,
      asset: a.asset,
      label: data.label,
      filter: a.filter,
      repo: data.repo
    })
  }
  return jobs
}
*/

// This "compresses" rows with unique id+rk to just unique id so that we can
// display multiple asset + filter pairs per job id.
/*
const formatJobsToClumps = data => {
  const a = []
  for (const o of data) {
    if (a.some(e => e.id === o.id)) {
      let x = a.filter(e => e.id === o.id)[0]
      x.assets.push({ asset: o.asset, filter: o.filter })
    } else {
      a.push({
        app: o.app,
        id: o.id,
        repo: o.repo,
        label: o.label,
        assets: [{ asset: o.asset, filter: o.filter }],
        handleFormSubmit: handleFormSubmit,
        handleClumpDelete: handleClumpDelete
      })
    }
  }
  return a
}
*/

///////////////////////////////////////////////////////////////////////////////
const JobList = props => {
  //console.log('-------ClumpList props-------')
  //console.log(props)

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
      let jobs = dbToList(dbJobs.data.listJobsByApp)

      //let clumps = formatJobsToClumps(resClumps.data.listJobsByApp)
      setJobs(jobs)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchJobs(props.app)
  }, [props.app])

  ///
  /*
  useEffect(() => {
    try {
      const subscription = API.graphql(graphqlOperation(onPutJobs)).subscribe({
        next: data => {
          console.log('sssssssssssssssss')
          console.log(data)
          //const { value: { data: { onCreateTalk } }} = data
          //const talkData = [...talks, onCreateTalk]
          //updateTalks(talkData)
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [])
  */
  ///

  return isLoading ? (
    <Loader>loading</Loader>
  ) : (
    <div>
      {jobs.map(job => (
        <Job key={job.id} job={job} />
      ))}
      <hr></hr>
      <ModalJobForm job={emptyJob} />
    </div>
  )
}

export default JobList
