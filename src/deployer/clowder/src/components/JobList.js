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

const assetChoice = `query metaStuff {
  __type(name: "Asset"){
    enumValues {
      name
    }
  }
}`

///////////////////////////////////////////////////////////////////////////////
const JobList = props => {
  const [jobs, setJobs] = useState([])
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)

      try {
        let resApps = await API.graphql(graphqlOperation(assetChoice))
        let assets = resApps.data.__type.enumValues.map(o => ({
          key: o.name,
          text: o.name,
          value: o.name
        }))

        let resJobs = await API.graphql(
          graphqlOperation(listJobsByApp, { app: props.app.toUpperCase() })
        )
        let jobs = resJobs.data.listJobsByApp
        setAssets(assets)
        setJobs(jobs)
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
    fetchJobs()
  }, [props.app])

  return isLoading ? (
    <Loader>loading</Loader>
  ) : (
    <div>
      {jobs.map(job => (
        <Job key={`${job.id}-${job.rk}`} job={job} assets={assets} />
      ))}
    </div>
  )
}

export default JobList
