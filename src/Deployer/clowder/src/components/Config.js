import React from 'react'

const Config = props => {
  console.log(process.env)
  return <h3>hello from config </h3>
}
export default Config

// pipeline resolver kinda like step function but it can
// permit a multi-stage VTL resolver

//two types of context: user + extra resolver fields

// maybe ElasticCache

// adrian hall
