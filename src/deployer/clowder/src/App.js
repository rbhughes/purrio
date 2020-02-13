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

//////////////////////////// move this stuff

//////////////////////////// move this stuff
const awsmobile = {
  aws_project_region: 'us-east-2',
  aws_cognito_region: 'us-east-2',
  aws_appsync_region: 'us-east-2',
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_user_pools_id: 'us-east-2_bteTsn2nr',
  aws_user_pools_web_client_id: '7dsl41vmtkpsp859e1vdclr34g',
  aws_cognito_identity_pool_id:
    'us-east-2:c9c99ae4-6091-478e-84de-c532c2f05484',
  aws_appsync_graphqlEndpoint:
    'https://mupetkhoizhm5dqb6wxplr4vi4.appsync-api.us-east-2.amazonaws.com/graphql'
}

Amplify.configure(awsmobile)

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
          render={p => (
            <JobList {...p} app="geographix" assets={props.assets} />
          )}
        />
        <Route
          path="/kingdom"
          render={p => <JobList {...p} app="kingdom" assets={props.assets} />}
        />
        <Route
          path="/petra"
          render={p => <JobList {...p} app="petra" assets={props.assets} />}
        />
        <Route path="/config" component={Config} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

// assets gets passed: HeaderBar -> JobList -> Job -> ModalJobForm
const App = () => {
  //const foo = useContext(AssetContext)
  //console.log('foooooooo')
  //console.log(foo)
  /*
  const [assets, setAssets] = useState([])
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        let resApps = await API.graphql(graphqlOperation(assetChoice))
        let assets = resApps.data.__type.enumValues.map(o => ({
          key: o.name,
          text: o.name,
          value: o.name
        }))
        setAssets(assets)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAssets()
  }, [])
  */
  //return <HeaderBar assets={assets} />
  //let ass = useContext(AssetContext)
  //console.log('=========')
  //console.log(ass)

  //return <HeaderBar assets={[]} />
  return <HeaderBar assets={[]} />
}

export default withAuthenticator(App)
