import React, { Component } from 'react'
import '../App.css'
import stackeryLogo from '../images/hazel.jpg'
import reactLogo from '../images/fairuza.jpg'

class About extends Component {
  render() {
    return (
      <div className="about">
        <a href="https://www.stackery.io">
          <img
            src={stackeryLogo}
            className="stackery-logo"
            alt="stackery-logo"
          />
        </a>
        <p className="plus">+</p>
        <a href="https://reactjs.org/">
          <img src={reactLogo} className="react-logo" alt="react-logo" />
        </a>
      </div>
    )
  }
}

export default About
