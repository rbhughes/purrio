import React, { useState, useEffect } from 'react'
import { Loader } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Job from './Job'

// ignores case on Windows
const Crypto = require('crypto')
const hashify = s => {
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
    asset
    label
    filter
    repo
  }
}`

const formatJobsForForm = data => {
  console.log('--------data---------')
  console.log(data)
}

///////////////////////////////////////////////////////////////////////////////
const JobList = props => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchJobs = async app => {
    setIsLoading(true)

    try {
      let resJobs = await API.graphql(
        graphqlOperation(listJobsByApp, { app: app.toUpperCase() })
      )
      //console.log('-------raw--------')
      formatJobsForForm(resJobs.data.listJobsByApp)
      setJobs(resJobs.data.listJobsByApp)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchJobs(props.app)
  }, [props.app])

  return isLoading ? (
    <Loader>loading</Loader>
  ) : (
    <div>
      {jobs.map(job => (
        <Job key={`${job.id}-${job.rk}`} job={job} assets={props.assets} />
      ))}
    </div>
  )
}

export default JobList
