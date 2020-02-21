import React, { useState, useEffect } from 'react'
import { Loader } from 'semantic-ui-react'
import { API, graphqlOperation } from 'aws-amplify'
import Clump from './Clump'

import ModalClumpForm from './ModalClumpForm'

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
    asset
    label
    filter
    repo
  }
}`

const batchDeleteJobs = `mutation BatchDeleteJobs($pairs: [JobKeyPair]) {
  batchDeleteJobs(pairs: $pairs) {
    id
    rk
  }
}`

const batchPutJobs = `mutation BatchPutJobs($jobs: [JobInput]) {
  batchPutJobs(jobs: $jobs) {
    id
    rk
  }
}`

const onPutJobs = `subscription OnPutJobs {
  onPutJobs {
    id
    rk
    repo
  }
}`

const handleFormSubmit = async data => {
  console.log('-----handleFormSubmit-------')
  try {
    const jobs = formatClumpToJobs(data)
    let res = await API.graphql(graphqlOperation(batchPutJobs, { jobs: jobs }))
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

const handleClumpDelete = async data => {
  console.log('---------handleClumpDelete--------')
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
        handleFormSubmit: handleFormSubmit,
        handleClumpDelete: handleClumpDelete
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

  const emptyClump = {
    app: props.app.toUpperCase(),
    repo: '',
    label: '',
    assets: [{ asset: '', filter: '' }],
    handleFormSubmit: handleFormSubmit,
    handleClumpDelete: handleClumpDelete
  }

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

  ///
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
  ///

  return isLoading ? (
    <Loader>loading</Loader>
  ) : (
    <div>
      {clumps.map(clump => (
        <Clump key={clump.id} clump={clump} />
      ))}
      <hr></hr>
      <ModalClumpForm clump={emptyClump} />
    </div>
  )
}

export default ClumpList
