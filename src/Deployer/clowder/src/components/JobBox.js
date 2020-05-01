import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Grid,
  Divider,
  Header,
  Icon,
  Label,
  List,
  Message,
  Segment,
  Transition
} from 'semantic-ui-react'

import { API, graphqlOperation } from 'aws-amplify'
import ModalJobForm from './ModalJobForm'
import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'
import { WorkerStore } from './WorkerContext'

////////////////////////////////////////////////////////////////////////////////

const WorkerStatus = (props) => {
  return (
    <Card fluid>
      <Button
        onClick={async (event) => {
          await props.job.handleWorkerPing(event, props.job)
        }}
      >
        ping a worker
      </Button>

      <Button
        onClick={async (event) => {
          let deleted = await props.job.handleNotesDelete(event, props.job)
          if (deleted) {
            props.setNotes([])
            props.dispatch({
              id: props.job.id,
              type: 'reset'
            })
          }
        }}
      >
        clear messages
      </Button>
    </Card>
  )
}

const WorkerStatusSpinner = (props) => {
  let batchCount = 0
  let itemCount = 0
  if (props.state) {
    batchCount = props.state.batchCount ? props.state.batchCount : 0
    itemCount = props.state.itemCount ? props.state.itemCount : 0
  }

  return (
    <Message icon>
      <Icon
        className={batchCount + itemCount > 0 ? 'loading' : ''}
        name="circle notched"
      />
      <Message.Content>
        <Message.Header>Worker Progress</Message.Header>
        <List>
          <List.Item>Remaining Batches: {batchCount}</List.Item>
          <List.Item>Remaining Items: {itemCount}</List.Item>
        </List>
      </Message.Content>
    </Message>
  )
}

const MessageList = (props) => {
  return (
    <Card fluid>
      <List>
        {props.notes
          .sort((a, b) => (a.rk < b.rk ? 1 : -1))
          .map((note) => (
            <MessageListItem key={note.rk} note={note} />
          ))}
      </List>
    </Card>
  )
}

const MessageListItem = (props) => {
  const n = JSON.parse(props.note.cargo)
  //const className = n.class
  const lead = n.text

  delete n.class
  delete n.text

  const main = JSON.stringify(n)

  const item = n.error ? (
    <Header as="h5" color="red">
      {lead}
      <Divider />
      {JSON.stringify(n.error, null, 2)}
    </Header>
  ) : (
    <Header as="h5">
      <code>
        {lead} | {main}
      </code>
    </Header>
  )
  return (
    <List.Item>
      <List.Content>
        <List.Description>{item}</List.Description>
      </List.Content>
    </List.Item>
  )
}

/*
const handleFakeMessage = async (job) => {
  try {
    const fake = {
      id: job.id,
      rk: Date.now().toString(),
      message: JSON.stringify({
        class: 'info',
        msg: `FAKE message says Hello ${Date.now()}`
      })
    }
    await API.graphql(graphqlOperation(mutations.createNote, { note: fake }))
  } catch (error) {
    console.error(error)
  }
}
*/

////////////////////////////////////////////////////////////////////////////////

const JobBox = (props) => {
  const [notes, setNotes] = useState([])
  const [visible, setVisible] = useState(false)
  const { state, dispatch } = WorkerStore()

  useEffect(() => {
    const fetchNotes = async () => {
      const dbNotes = await API.graphql(
        graphqlOperation(queries.listNotesByPKey, { id: props.job.id })
      )
      setNotes(dbNotes.data.listNotesByPKey)
    }
    fetchNotes()
  }, [props.job.id])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateNote)
    ).subscribe({
      next: (res) => {
        const createdNote = res.value.data.onCreateNote

        if (createdNote.id === props.job.id) {
          setNotes((notes) => [...notes, createdNote])
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [props.job.id])

  return (
    <Segment>
      <Grid>
        <Grid.Row>
          <Grid.Column width={11}>
            <List divided horizontal size="huge">
              <List.Item>
                <code>{props.job.repo}</code>
              </List.Item>
              <List.Item>
                <Label tag>{props.job.label}</Label>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={5}>
            <Button.Group floated="right">
              <Button
                content={visible ? 'Hide' : 'Reveal'}
                onClick={() => {
                  setVisible(!visible)
                }}
              />

              <ModalJobForm job={props.job} />
              <Button
                onClick={(e) => {
                  props.job.handleJobDelete(e, props.job)
                }}
              >
                Delete
              </Button>
              <Button>Schedule</Button>

              <Button
                onClick={(e) => {
                  props.job.handleEnqueue(e, props.job)
                }}
              >
                Enqueue
              </Button>
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
              <WorkerStatusSpinner state={state[props.job.id]} />
              <WorkerStatus
                job={props.job}
                setNotes={setNotes}
                dispatch={dispatch}
              />
            </Grid.Column>
            <Grid.Column
              width={13}
              style={{ maxHeight: 200, overflow: 'auto' }}
            >
              <MessageList notes={notes} />
            </Grid.Column>
          </Grid.Row>
        </Transition>
      </Grid>
    </Segment>
  )
}

export default JobBox
