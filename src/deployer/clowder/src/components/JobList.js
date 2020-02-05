import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Grid,
  Image,
  Label,
  Form,
  Input,
  Divider,
  Header,
  Modal,
  Container,
  Loader,
  Segment,
  Transition,
  List
} from 'semantic-ui-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { API, graphqlOperation } from 'aws-amplify'

//import * as mutations from './../graphql/mutations'
//import * as queries from './../graphql/queries'
//import * as subscriptions from './../graphql/subscriptions'
//import * as custom from './../graphql/custom'

//import JobForm from './JobForm'
//import JobList from './JobList'

//import { routedLambda, batcherLambdaName, enqueueLambdaName } from '../utility'
//import { useInputChange } from './useInputChange'

const listJobsAndMessages = `query ListJobs($filter: ModelJobFilterInput, $limit: Int, $nextToken: String) {
  listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      active
      assets
      app
      auxiliary
      filter
      label
      messages {
        items {
          id
          content
          modified
        }
      }
      modified
      owner
      repo
      status
    }
    nextToken
  }
}
`

const listJobs = `query ListJobs {
  listJobs{
    id
    repo
  }
}
`

/*
const getJobs = async app => {
  try {
    //const res = await API.graphql(graphqlOperation(queries.listJobs))
    const res = await API.graphql(
      graphqlOperation(listJobsAndMessages)
      //graphqlOperation(queries.listJobs)
    )
    //console.log('|||||||||||||||||||')
    //console.log(res.data.listJobs.items)
    //console.log('|||||||||||||||||||')

    const filteredJobs = res.data.listJobs.items.filter(
      job => job.app.toLowerCase() === app
    )
    return filteredJobs
    return res.data.listJobs.items
  } catch (error) {
    console.error(error)
    //let e = new Error(error)
    //console.error(e.stack)
  }
}
*/

const assetList = [
  {
    key: 'BUSINESS_ASSOCIATE',
    text: 'BUSINESS_ASSOCIATE',
    value: 'BUSINESS_ASSOCIATE'
  },
  { key: 'DIGITAL_LOG', text: 'DIGITAL_LOG', value: 'DIGITAL_LOG' },
  {
    key: 'DIRECTIONAL_SURVEY',
    text: 'DIRECTIONAL_SURVEY',
    value: 'DIRECTIONAL_SURVEY'
  },
  { key: 'WELL_HEADER', text: 'WELL_HEADER', value: 'WELL_HEADER' }
]

const Job = props => {
  const [visible, setVisible] = useState(false)

  return (
    <Segment>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <List divided horizontal size="huge">
              <List.Item>
                <code>{props.job.repo}</code>
              </List.Item>
              <List.Item>
                <Label tag>{props.job.label}</Label>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <Button.Group>
              <ModalExample job={props.job} />
              <Button
                content={visible ? 'Hide' : 'Show'}
                onClick={() => {
                  setVisible(!visible)
                }}
              />
              <Button>Enqueue</Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>

        <Transition
          visible={visible}
          unmountOnHide={true}
          animation="fade"
          duration={200}
        >
          <Grid.Row>
            <Grid.Column width={3}>
              <Card fluid>
                assets
                <Image
                  size="small"
                  src="https://react.semantic-ui.com/images/leaves/1.png"
                />
              </Card>
            </Grid.Column>
            <Grid.Column width={13}>
              <Card fluid>
                messages
                <Image
                  size="small"
                  src="https://react.semantic-ui.com/images/leaves/1.png"
                />
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Transition>
      </Grid>
    </Segment>
  )
}

// https://github.com/react-hook-form/react-hook-form/issues/85
// https://codesandbox.io/s/semantic-ui-react-form-hooks-vnyjh?from-embed
const ModalExample = props => {
  useEffect(() => {
    register({ name: 'label' }, { required: true })
    register({ name: 'repo' }, { required: true })
    register({ name: 'assets' }, { required: true })
  }, [])

  const {
    control,
    register,
    handleSubmit,
    errors,
    setValue,

    triggerValidation
  } = useForm({
    defaultValues: {
      label: props.job.label,
      repo: props.job.repo,
      assets: [{ asset: 'WELL_HEADER', filter: 'useFieldArray' }]
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets'
  })

  const onSubmit = data => console.log(data)

  if (errors.length > 0) {
    console.error(errors)
  }
  return (
    <Modal trigger={<Button>Edit</Button>}>
      <Modal.Header>
        {props.job.app}|{props.job.id}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Create or Edit</Header>
        </Modal.Description>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Input
              defaultValue={props.job.repo}
              label="repo"
              type="text"
              placeholder="repo"
              name="repo"
              fluid
              onChange={async (e, { name, value }) => {
                setValue(name, value)
                await triggerValidation({ name })
              }}
              error={errors.repo ? true : false}
            />
            <Form.Input
              defaultValue={props.job.label}
              label="label"
              type="text"
              placeholder="label"
              name="label"
              fluid
              onChange={async (e, { name, value }) => {
                setValue(name, value)
                await triggerValidation({ name })
              }}
              error={errors.label ? true : false}
            />
          </Form.Group>

          <Divider />

          {fields.map((item, index) => {
            return (
              <Container key={item.id} fluid>
                <Form.Group widths="equal">
                  <Form.Field>
                    {index === 0 && <label>asset</label>}
                    <select name={`assets[${index}].asset`} ref={register}>
                      {assetList.map(x => {
                        return <option key={x.key}>{x.value}</option>
                      })}
                    </select>
                  </Form.Field>
                  <Form.Field>
                    {index === 0 && <label>filter</label>}
                    <Input name={`assets[${index}].filter`} ref={register} />
                  </Form.Field>

                  <Form.Field>
                    {index === 0 && <label>&nbsp;</label>}
                    <Button type="button" onClick={() => remove(index)}>
                      Remove
                    </Button>
                    {index === 0 && (
                      <Button
                        type="button"
                        floated="right"
                        onClick={() => append(index)}
                      >
                        Add New Asset
                      </Button>
                    )}
                  </Form.Field>
                </Form.Group>
              </Container>
            )
          })}
          <Divider />

          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

/*
const JobForm = props => {
  return (
    <div>
      <Modal
        //open={this.state.modalOpen}
        //onClose={this.handleClose}
        closeOnDimmerClick={false}
        size="small"
      >
        <Header
          icon="browser" //content={this.actionLabel()}
        />
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Input
                label="label"
                placeholder="label"
                name="label"
                //value={this.state.job.label}
                //onChange={this.handleChange}
              />
              <Form.Dropdown
                label="application"
                placeholder="pick app"
                name="app"
                selection
                //options={this.props.appChoice}
                //onChange={this.handleChange}
                //value={this.state.job.app}
                disabled={true}
              />
              <Form.Input
                label="owner"
                name="owner"
                //value={this.props.owner}
                disabled={true}
              />
            </Form.Group>
            <Form.Input
              label="repo"
              placeholder="path to project"
              name="repo"
              ///value={this.state.job.repo}
              //onChange={this.handleChange}
            />
            <Form.Input
              //label={this.customAuxText(this.state.job.app).label}
              //placeholder={this.customAuxText(this.state.job.app).placeholder}
              name="auxiliary"
              //value={this.state.job.auxiliary}
              //onChange={this.handleChange}
            />
            <Form.Dropdown
              label="assets"
              placeholder="assets"
              name="assets"
              multiple
              selection
              //options={this.props.assetChoice}
              //onChange={this.handleChange}
              //value={this.state.job.assets}
            />
            <Form.Checkbox
              label="active?"
              name="active"
              defaultChecked
              fitted
              toggle
              //onChange={this.handleChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            //onClick={this.handleClose}
            inverted
          >
            <Icon name="checkmark" /> Cancel
          </Button>
          <Button
            color="green"
            //onClick={this.handleSubmit}
            inverted
          >
            <Icon name="checkmark" /> Save
          </Button>
        </Modal.Actions>
      </Modal>
      <Button
      //onClick={this.handleOpen}>{this.actionLabel()}
      >
        button me
      </Button>
    </div>
  )
}
*/

const JobList = props => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      //const res = await API.graphql(graphqlOperation(listJobsAndMessages))
      let res
      try {
        res = await API.graphql(graphqlOperation(listJobs))
        console.log(res)
      } catch (error) {
        console.error(error)
      }
      setJobs(res.data.listJobs)
      setIsLoading(false)
    }
    fetchJobs()
  }, [])

  return isLoading ? (
    <Loader>loading</Loader>
  ) : (
    <div>
      {jobs.map(job => (
        <Job key={job.id} job={job} />
      ))}
    </div>
  )

  /*
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="repo"
          name="repo"
          ref={register({ required: true, maxLength: 100 })}
        />
        <select name="app" ref={register}>
          <option value="geographix">geographix</option>
          <option value="kingdom">kingdom</option>
          <option value="petra">petra</option>
        </select>
        <select name="asset" ref={register}>
          <option value="WELL">WELL</option>
          <option value="DIR_SURVEY">DIR_SURVEY</option>
          <option value="TOPS">TOPS</option>
        </select>

        <input type="submit" />
      </form>
    </>
  )
  */
}

// The owner is NOT read/set here, it is set via graphql resolver
// Mutation.createJob.req.vtl and relies on $context.identity.username
// ...but I want that to be an email, which it sorta is not right now

/*
class JobsZZZ extends Component {
  state = {
    owner: '',
    jobs: [],
    appChoice: [],
    assetChoice: []
  }

  jobCreateSub = null
  jobUpdateSub = null
  messageCreateSub = null

  getOwner = async () => {
    try {
      const u = await Auth.currentAuthenticatedUser()
      return u.attributes.email
    } catch (error) {
      console.error(error)
    }
  }

  getJobs = async () => {
    try {
      //const res = await API.graphql(graphqlOperation(queries.listJobs))
      const res = await API.graphql(
        graphqlOperation(custom.listJobsAndMessages)
        //graphqlOperation(queries.listJobs)
      )
      console.log('|||||||||||||||||||')
      console.log(res)
      console.log('|||||||||||||||||||')

      const filteredJobs = res.data.listJobs.items.filter(
        job => job.app.toLowerCase() === this.props.app
      )
      return filteredJobs
    } catch (error) {
      console.error(error)
      //let e = new Error(error)
      //console.error(e.stack)
    }
  }

  getAppChoice = async () => {
    const AppChoice = `query metaStuff {
      __type(name: "Application"){
        enumValues {
          name
        }
      }
    }`
    try {
      const resApps = await API.graphql(graphqlOperation(AppChoice))
      return resApps.data.__type.enumValues.map(o => ({
        key: o.name,
        text: o.name,
        value: o.name
      }))
    } catch (error) {
      console.error(error)
    }
  }

  getAssetChoice = async () => {
    const AssetChoice = `query metaStuff {
      __type(name: "Asset"){
        enumValues {
          name
        }
      }
    }`
    try {
      const resAssets = await API.graphql(graphqlOperation(AssetChoice))
      return resAssets.data.__type.enumValues.map(o => ({
        key: o.name,
        text: o.name,
        value: o.name
      }))
    } catch (error) {
      console.error(error)
    }
  }

  // use to detect HeaderMenu clicks, where category changes
  async componentDidUpdate(prevProps) {
    if (this.props.app !== prevProps.app) {
      this.setState({
        jobs: await this.getJobs()
        //jobs: []
      })
    }
  }

  async componentDidMount() {
    try {
      this.jobCreateSub = await API.graphql(
        graphqlOperation(subscriptions.onCreateJob)
      ).subscribe({
        next: res => {
          const createdJob = res.value.data.onCreateJob
          const updatedJobs = this.state.jobs.concat(createdJob)
          this.setState({ jobs: updatedJobs })
          //console.log(`jobCreateSub: job.id=${createdJob.id}`)
        }
      })
    } catch (error) {
      console.error(error)
    }

    try {
      this.jobUpdateSub = await API.graphql(
        graphqlOperation(subscriptions.onUpdateJob)
      ).subscribe({
        next: res => {
          const updatedJob = res.value.data.onUpdateJob
          let updatedJobs = this.state.jobs.map(j => {
            return j.id === updatedJob.id ? updatedJob : j
          })
          this.setState({ jobs: updatedJobs })
          //console.log(`jobUpdateSub: a job got updated`)
        }
      })
    } catch (error) {
      console.error(error)
    }

    ///---
    //TODO review this janky behavior:
    // The job's messages (child) component gets updated on the first load.
    // BUT it also needs to respond and update the UI when graphql mutations
    // update the dynamodb table from outside this react app. A subscription
    // triggers this inelegant push and render.
    try {
      this.messageCreateSub = await API.graphql(
        graphqlOperation(subscriptions.onCreateMessage)
      ).subscribe({
        next: res => {
          console.log('rrrr messageCreateSub  rrrrr')
          console.log(res.value.data.onCreateMessage)
          //const jobId = res.value.data.onCreateMessage.job.id
          const jobId = res.value.data.onCreateMessage.messageJobId
          let updatedJobs = this.state.jobs.map(j => {
            if (j.id === jobId) {
              j.messages.items.push(res.value.data.onCreateMessage)
            }
            return j
          })
          this.setState({ jobs: updatedJobs })
        }
      })
    } catch (error) {
      console.error(error)
    }

    ///---

    this.setState({
      owner: await this.getOwner(),
      jobs: await this.getJobs(),
      appChoice: await this.getAppChoice(),
      assetChoice: await this.getAssetChoice()
    })
  }

  componentWillUnmount() {
    this.jobCreateSub.unsubscribe()
    this.jobUpdateSub.unsubscribe()
    this.messageCreateSub.unsubscribe()
  }

  //

  // TODO: watch out for security token expired (if the page sits a while before clicking Enqueue)

  handleEnqueueJob = async event => {
    event.preventDefault()
    event.persist() //so that we can set/unset loading class
    event.target.className += ' loading'

    ///
    const currCred = await Auth.currentCredentials()
    const cred = Auth.essentialCredentials(currCred)
    cred.region = process.env.REACT_APP_AWS_REGION
    //const kittybox = process.env.REACT_APP_KITTYBOX_FUNCTION_NAME
    ///

    try {
      const job = this.state.jobs.filter(
        job => job.id === event.target.value
      )[0]

      //console.log('===job===========================')
      //console.log(job)

      const dbConnection = await routedLambda({
        route: { app: job.app, asset: 'database' },
        cargo: job
      })
      console.log('===dbConnector===================')
      console.log(dbConnection)

      for (let asset of job.assets) {
        const assetCore = await routedLambda({
          route: { app: job.app, asset: asset }
        })
        console.log('===assetCore===================')
        console.log(assetCore)

        // one enqueue per asset
        const jobEnqueue = await routedLambda({
          route: { app: 'any', asset: 'enqueue' },
          cargo: {
            attr_app: job.app.toLowerCase(),
            attr_target: 'database',
            attr_directive: 'batcher',

            asset: asset.toLowerCase(),
            lambda_asset: assetCore.lambda,
            lambda_batcher: batcherLambdaName,
            lambda_enqueue: enqueueLambdaName,
            label: job.label,
            job_id: job.id,

            chunk: assetCore.chunk,
            counter: assetCore.counter,
            selector: assetCore.selector,
            db_params: dbConnection.db_params
          }
        })
        console.log('===jobEnqueue===================')
        console.log(jobEnqueue)
      }

      await API.graphql(
        graphqlOperation(mutations.updateJob, {
          input: {
            id: job.id,
            modified: Date.now(),
            status: 'ENQUEUED'
          }
        })
      )

      event.target.className = event.target.className.replace(/ loading/g, '')
    } catch (error) {
      console.log(error)
    }
  }

  handleEnqueueAllJobs = async jobs => {
    const activeJobs = jobs.filter(
      o => o.active && o.app.toLowerCase() === this.props.app
    )
    if (activeJobs.length > 0) {
      activeJobs.forEach(job => {
        console.log(job)
        //params.Entries.push({
        //  Id: job.id,
        //  MessageBody: JSON.stringify(job)
        //})
      })
      //console.log(`handleEnqueueAllJobs: ${params.Entries.map(e => e.Id).join(', ')}`)
    } else {
      let msg = 'no active jobs found to enqueue'
      console.log(msg)
      return msg
    }
  }

  handleDeleteJob = async event => {
    console.log('handleDeleteJob got clicked')
    event.preventDefault()
    event.target.className += ' loading'
    const fewerJobs = this.state.jobs.filter(
      job => job.id !== event.target.value
    )

    try {
      //const res = await API.graphql(
      await API.graphql(
        graphqlOperation(mutations.deleteJob, {
          input: { id: event.target.value }
        })
      )
      this.setState({ jobs: fewerJobs })
      //console.log(res)
    } catch (error) {
      console.error(error)
    }
  }

  handleClearJobMessages = async event => {
    console.log('handleClearJobMessages got clicked')
    event.preventDefault()
    event.persist()
    event.target.className += ' loading'
    try {
      await API.graphql(
        graphqlOperation(mutations.batchDeleteMessage, {
          ids: JSON.parse(event.target.value)
        })
      )
      let updatedJobs = this.state.jobs.map(j => {
        if (j.id === event.target.id) {
          j.messages.items = []
        }
        return j
      })
      this.setState({ jobs: updatedJobs })
      event.target.className = event.target.className.replace(/ loading/g, '')
    } catch (error) {
      console.error(error)
    }
  }

  // just a way to simulate an external event
  handleFakeMessage = async event => {
    console.log('handleFakeMessage got clicked')
    event.preventDefault()
    event.persist()
    event.target.className += ' loading'
    try {
      await API.graphql(
        graphqlOperation(mutations.createMessage, {
          input: {
            messageJobId: event.target.value,
            content: `simulated external event for: messageJobId=${
              event.target.value
            } ${Date.now()}`
          }
        })
      )
      event.target.className = event.target.className.replace(/ loading/g, '')
    } catch (error) {
      console.error(error)
    }
  }

  handleFormSubmit = async (action, job) => {
    let mutationType = action === 'create' ? 'createJob' : 'updateJob'

    try {
      // eslint-disable-next-line
      for (let a of job.assets) {
        console.log(`enqueue COUNTER job for ${a}`)
      }
      console.log('hhhhhhh handleFormSubmit=========')
      console.log(`mutationType=${mutationType}`)
      console.log(job)
      //let mutJob = await API.graphql(
      await API.graphql(
        graphqlOperation(mutations[mutationType], {
          input: {
            id: job.id,
            active: job.active,
            assets: job.assets,
            app: this.props.app.toUpperCase(),
            //filter: null,
            label: job.label,
            //messages: job.messages.items,
            modified: Date.now(),
            owner: job.owner,
            repo: job.repo,
            auxiliary: job.auxiliary,
            status: job.status
          }
        })
      )

      //let mutJobID = mutJob.data[mutationType].id
      //let msg = await API.graphql(
      //  graphqlOperation(mutations.createMessage, {
      //    input: {
      //      messageJobId: mutJobID,
      //      content: `MESSAGE! messageJobId=${mutJobID} ${Date.now()}`
      //    }
      //  })
      //)
      //console.log('xxxxxxxxxxx_mutations.createMessage_xxxxxxxxxxxxxx')
      //console.log(msg.data.createMessage.id)
      //console.log(msg.data.createMessage.content)
      ///console.log(msg.data.onCreateMessage.content)
    } catch (error) {
      console.error(error)
    }

    //console.log(
    //  `_____ handleFormSubmit [${action}] --- id = ${res.data[mutationType].id} | jobs=${
    //    this.state.jobs.length
    //  }`
    //)
  }

  render() {
    if (this.state.owner) {
      return (
        <Segment>
          <h1>{this.props.app}</h1>

          <JobList
            jobs={this.state.jobs}
            deleteJob={this.handleDeleteJob}
            clearJobMessages={this.handleClearJobMessages}
            fakeMessage={this.handleFakeMessage}
            enqueueJob={this.handleEnqueueJob}
            formSubmit={this.handleFormSubmit}
            owner={this.state.owner}
            appChoice={this.state.appChoice}
            assetChoice={this.state.assetChoice}
          />

          <JobForm
            action={'create'}
            formSubmit={this.handleFormSubmit}
            job={{}}
            owner={this.state.owner}
            app={this.props.app}
            appChoice={this.state.appChoice}
            assetChoice={this.state.assetChoice}
          />

          <Button
            color="pink"
            onClick={() => {
              this.handleEnqueueAllJobs(this.state.jobs)
            }}
          >
            Enqueue All
          </Button>
        </Segment>
      )
    } else {
      return (
        <Segment>
          <Dimmer active inverted>
            <Loader size="huge" indeterminate>
              Loading...
            </Loader>
          </Dimmer>
        </Segment>
      )
    }
  }
}
*/
//export default Jobs
export default JobList
