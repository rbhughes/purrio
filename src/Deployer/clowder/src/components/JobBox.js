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

const WorkerStatus = (props) => {
  if (props.batchCount < 1) {
    // workers are idle
    return (
      <Card fluid>
        <Button
          onClick={async (e) => {
            await props.job.handleWorkerPing(e, props.job)
          }}
        >
          ping a worker
        </Button>

        <Button
          onClick={async (e) => {
            let deleted = await props.job.handleNotesDelete(e, props.job)
            if (deleted) {
              props.setNotes([])
              props.setBatchCount(0)
              props.setItemCount(0)
            }
          }}
        >
          clear messages
        </Button>
      </Card>
    )
  } else {
    // workers are processing a job
    return (
      <Card>
        <Message icon>
          <Icon loading name="circle notched" />
          <Message.Content>
            <Message.Header hidden>Worker Progress</Message.Header>
            <List>
              <List.Item>Remaining Batches: {props.batchCount}</List.Item>
              <List.Item>Remaining Items: {props.itemCount}</List.Item>
            </List>
          </Message.Content>
        </Message>
      </Card>
    )
  }
}

/*
const Thing = (props) => {
  if (props.batchCount < 1) {
    console.log('SHOULD STOP IT NOW')
  } else {
    console.log('SHOW DAT SPINNER')
  }
  return (
    <Header>
      batchCount={props.batchCount} itemCount={props.itemCount}
    </Header>
  )
}
*/

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

const JobBox = (props) => {
  console.log('____________JobBox')
  console.log(props)
  const [notes, setNotes] = useState([])
  const [visible, setVisible] = useState(false)
  const [batchCount, setBatchCount] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [currentJobId, setCurrentJobId] = useState(props.job.id)

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
        setCurrentJobId(createdNote.id)
        if (createdNote.id === props.job.id) {
          setNotes((notes) => [...notes, createdNote])
        }

        const cargo = JSON.parse(createdNote.cargo)
        if (cargo.action && cargo.action === 'set_counts') {
          setBatchCount((batchCount) => (batchCount += cargo.batch_count))
          setItemCount((itemCount) => (itemCount += cargo.item_count))
        } else if (cargo.action && cargo.action === 'decrement') {
          setBatchCount((batchCount) => (batchCount -= 1))
          setItemCount((itemCount) => (itemCount -= cargo.item_count))
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
                <Label tag>asset count = {props.job.assets.length}</Label>
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
              {batchCount < 1 ? (
                <Header>
                  {batchCount} no batches {props.job.id}
                </Header>
              ) : (
                <Header>
                  {batchCount} processing! {props.job.id}
                </Header>
              )}
              {props.job.id === currentJobId ? (
                <WorkerStatus
                  job={props.job}
                  setNotes={setNotes}
                  setBatchCount={setBatchCount}
                  setItemCount={setItemCount}
                  batchCount={batchCount}
                  itemCount={itemCount}
                />
              ) : (
                <Header>nope</Header>
              )}
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
