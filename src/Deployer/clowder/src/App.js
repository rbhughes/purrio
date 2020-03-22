import React from 'react'

import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch
} from 'react-router-dom'
import Amplify, { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
import { Menu } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'

import Config from './components/Config'
import JobList from './components/JobList'

import purrCfg from './purr-cfg'
/////

/*
const awsmobile = {
  aws_project_region: 'us-east-2',
  aws_cognito_region: 'us-east-2',
  aws_appsync_region: 'us-east-2',
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_cognito_identity_pool_id:
    'us-east-2:06a52334-6edf-4c80-8e00-51554ec085bf',
  aws_user_pools_id: 'us-east-2_sBPeOqMdE',
  aws_user_pools_web_client_id: '2uo8qr3kf3pdjpb4c7ra8lat2t',
  aws_appsync_graphqlEndpoint:
    'https://xsickjdyxfcghgum62jyhswf4q.appsync-api.us-east-2.amazonaws.com/graphql'
}
*/

/*
REACT_APP_AWS_PROJECT_REGION=us-east-2
REACT_APP_AWS_COGNITO_REGION=us-east-2
REACT_APP_AWS_APPSYNC_REGION=us-east-2
REACT_APP_AWS_APPSYNC_AUTHENTICATIONTYPE=AWS_IAM
REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=us-east-2:06a52334-6edf-4c80-8e00-51554ec085bf
REACT_APP_AWS_USER_POOLS_ID=us-east-2_sBPeOqMdE
REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID=2uo8qr3kf3pdjpb4c7ra8lat2t
REACT_APP_AWS_APPSYNC_GRAPHQLENDPOINT=https://xsickjdyxfcghgum62jyhswf4q.appsync-api.us-east-2.amazonaws.com/graphql
REACT_APP_PURR_ORG=purrio
REACT_APP_PURR_ENV=dev
*/

Amplify.configure(purrCfg)
/*
Amplify.configure({
  aws_project_region: 'us-east-2',
  aws_cognito_region: 'us-east-2',
  aws_appsync_region: 'us-east-2',
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_cognito_identity_pool_id:
    'us-east-2:06a52334-6edf-4c80-8e00-51554ec085bf',
  aws_user_pools_id: 'us-east-2_sBPeOqMdE',
  aws_user_pools_web_client_id: '2uo8qr3kf3pdjpb4c7ra8lat2t',
  aws_appsync_graphqlEndpoint:
    'https://xsickjdyxfcghgum62jyhswf4q.appsync-api.us-east-2.amazonaws.com/graphql'
})
*/
/////
/////
/////

const Home = () => <h1>Home stuff goes here</h1>
const NotFound = () => (
  <h1>
    Not a valid route: <code>{window.location.pathname}</code>
  </h1>
)

const handleSignOut = async e => {
  e.preventDefault()
  try {
    let data = await Auth.signOut()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

const HeaderBar = props => {
  return (
    <Router>
      <Menu className="ui">
        <Menu.Item
          className="item"
          exact={true}
          as={NavLink}
          to="/"
          content="Home"
        />
        <Menu.Item
          className="item"
          as={NavLink}
          to="/geographix"
          content="GeoGraphix"
        />
        <Menu.Item
          className="item"
          as={NavLink}
          to="/kingdom"
          content="Kingdom"
        />
        <Menu.Item className="item" as={NavLink} to="/petra" content="Petra" />
        <Menu.Item
          className="item"
          as={NavLink}
          to="/config"
          content="Config"
        />
        <Menu.Item
          className="item"
          as={NavLink}
          to="signout"
          content="Sign Out"
          onClick={handleSignOut}
          position="right"
        />
      </Menu>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route
          path="/geographix"
          render={props => <JobList {...props} app="geographix" />}
        />
        <Route
          path="/kingdom"
          render={props => <JobList {...props} app="kingdom" />}
        />
        <Route
          path="/petra"
          render={props => <JobList {...props} app="petra" />}
        />
        <Route path="/config" component={Config} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

const App = () => {
  return <HeaderBar />
}

export default withAuthenticator(App)
