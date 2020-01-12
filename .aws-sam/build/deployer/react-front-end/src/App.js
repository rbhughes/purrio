import React, { Component } from 'react'
import { Route, NavLink, HashRouter } from 'react-router-dom'
import Amplify from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
import Home from './components/Home'
import Content from './components/Content'
import About from './components/About'
import './App.css'

//stolen from amplify project
const awsmobileCLOWDER = {
  aws_project_region: 'us-east-2',
  aws_cognito_identity_pool_id:
    'us-east-2:492ac176-1403-4204-9374-c9b9e3fbf5c5',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_Yjkkib0iV',
  aws_user_pools_web_client_id: '7b0u74fnoqo263ld4gtuumh63i',
  oauth: {},
  aws_appsync_graphqlEndpoint:
    'https://uowyvyasmvhzfk3k3c2mysovlq.appsync-api.us-east-2.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-2',
  aws_appsync_authenticationType: 'AWS_IAM'
}

// get from stackery after deploy

const awsmobile = {
  aws_project_region: 'us-east-2',
  //aws_cognito_identity_pool_id:
  //  'us-east-2:492ac176-1403-4204-9374-c9b9e3fbf5c5',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_QTqbdPKdX',
  aws_user_pools_web_client_id: '2jiu74d58a25capv7ipvf67nli',
  //oauth: {},
  aws_appsync_graphqlEndpoint:
    'https://gumkqzsmlbb4dcouemsyhyugzq.appsync-api.us-east-2.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-2',
  aws_appsync_authenticationType: 'AWS_IAM'
}

/*
https://gumkqzsmlbb4dcouemsyhyugzq.appsync-api.us-east-2.amazonaws.com/graphql
https://gumkqzsmlbb4dcouemsyhyugzq.appsync-api.us-east-2.amazonaws.com/graphql

user pool app client: clowder: 2jiu74d58a25capv7ipvf67nli
                               2jiu74d58a25capv7ipvf67nli

Pool Id us-east-2_QTqbdPKdX
        us-east-2_QTqbdPKdX
*/

Amplify.configure(awsmobile)

class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <div className="container">
            <ul className="nav">
              <li>
                <NavLink exact to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/content">Content</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
            </ul>
            <div className="pages">
              <Route exact path="/" component={Home} />
              <Route path="/content" component={Content} />
              <Route path="/about" component={About} />
            </div>
          </div>
        </HashRouter>
      </div>
    )
  }
}

//export default App
export default withAuthenticator(App, { includeGreetings: true })
