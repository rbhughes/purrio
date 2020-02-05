import React, { Component } from 'react'
import '../App.css'
import JobForm from './JobForm'

class GeoGraphix extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        <h2>GeoGraphix</h2>
        <p>GeoGraphix</p>
        {/*
        <JobForm
          action={'create'}
          //formSubmit={this.handleFormSubmit}
          job={{}}
          //owner={this.state.owner}
          app={this.props.app}
          //appChoice={this.state.appChoice}
          //assetChoice={this.state.assetChoice}
        />{' '}
        <JobForm />
        */}
      </div>
    )
  }
}

export default GeoGraphix
