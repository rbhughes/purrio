import React, { useState, useEffect } from 'react'
import { Loader } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Clump from './Clump'

// ignores case on Windows
const Crypto = require('crypto')

const hashify = s => {
  console.log('HASHIFY: ' + s)
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

const handleFormSubmit = data => {
  // format submitted object
  formatClumpToJobs(data)
  //write via graphql
}

// kinda like a GROUP BY asset+filter
const formatClumpToJobs = data => {
  const jobs = []
  for (const a of data.assets) {
    jobs.push({
      app: data.app,
      id: hashify(`${data.app}_${data.repo}_${data.label}`),
      rk: hashify(`${a.asset}_${a.filter}`),
      asset: a.asset,
      label: data.label,
      filter: a.filter,
      repo: data.repo
    })
  }
  console.log(jobs)
}

// This "compresses" rows with unique id+rk to just unique id so that we can
// display multiple asset + filter pairs per job id.
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
        submission: handleFormSubmit
      })
    }
  }
  return a
}

///////////////////////////////////////////////////////////////////////////////
const ClumpList = props => {
  //console.log('-------ClumpList props-------')
  //console.log(props)

  const [clumps, setClumps] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchClumps = async app => {
    setIsLoading(true)

    try {
      let resClumps = await API.graphql(
        graphqlOperation(listJobsByApp, { app: app.toUpperCase() })
      )
      let clumps = formatJobsToClumps(resClumps.data.listJobsByApp)
      setClumps(clumps)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchClumps(props.app)
  }, [props.app])

  return isLoading ? (
    <Loader>loading</Loader>
  ) : (
    <div>
      {clumps.map(clump => (
        <Clump key={clump.id} clump={clump} />
      ))}
    </div>
  )
}

export default ClumpList
