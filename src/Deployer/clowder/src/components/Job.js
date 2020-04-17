import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Grid,
  Label,
  List,
  Segment,
  Transition
} from 'semantic-ui-react'

import { API, graphqlOperation } from 'aws-amplify'
import ModalJobForm from './ModalJobForm'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'
//const hashify = require('../util').hashify
//const utility = require('../utility')

const MessageListItem = (props) => {
  const n = JSON.parse(props.note.message)
  return (
    <List.Item>
      {/*<Image avatar src="/images/avatar/small/rachel.png" />*/}
      <List.Content>
        <List.Description>
          {n.class}|{n.msg}
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

const handleFakeMessage = async (job) => {
  try {
    const fake = {
      id: job.id,
      rk: Date.now().toString(),
      message: JSON.stringify({
        id: job.id,
        message: `FAKE message says Hello ${Date.now()}`
      })
    }
    await API.graphql(graphqlOperation(mutations.createNote, { note: fake }))
  } catch (error) {
    console.error(error)
  }
}

const Job = (props) => {
  const [notes, setNotes] = useState([])
  const [visible, setVisible] = useState(false)

  const fetchNotes = async (id) => {
    //setIsLoading(true)

    try {
      const dbNotes = await API.graphql(
        graphqlOperation(queries.listNotesByPKey, { id: id })
      )
      setNotes(dbNotes.data.listNotesByPKey)
    } catch (error) {
      console.error(error)
    }
    //setIsLoading(false)
  }

  useEffect(() => {
    fetchNotes(props.job.id)
  }, [props.job.id])

  useEffect(() => {
    try {
      const subscription = API.graphql(
        graphqlOperation(subscriptions.onCreateNote)
      ).subscribe({
        next: (res) => {
          const createdNote = res.value.data.onCreateNote

          if (props.job.id === createdNote.id) {
            console.log('_______INTERCEPTED_______')
            console.log(props.job)
            console.log('_________________________')
            const updatedNotes = notes.concat(createdNote)
            setNotes(updatedNotes)

            const msg = JSON.parse(createdNote.message)
            if (msg.action && msg.action === 'decrement') {
              props.job.item_count -= msg.count
              props.job.batch_count -= 1
            } else if (msg.action && msg.action === 'set_counts') {
              props.job.item_count = msg.item_count
              props.job.batch_count = msg.batch_count
            }

            if (props.job.batch_count === 0) {
              console.log('THIS BATCH IS DONE')
            } else {
              console.log(props.job.batch_count)
            }
          }
        }
      })
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
    //}, [notes, props.job.id])
  }, [notes, props.job])

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
              <ModalJobForm job={props.job} />
              <Button
                content={visible ? 'Hide' : 'Show'}
                onClick={() => {
                  setVisible(!visible)
                }}
              />
              <Button
                onClick={(e) => {
                  props.job.handleJobDelete(e, props.job)
                }}
              >
                Delete
              </Button>
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
              <Card fluid>
                <Button
                  onClick={() => {
                    handleFakeMessage(props.job)
                  }}
                >
                  make fake message
                </Button>
                <Button
                  onClick={(e) => {
                    let deleted = props.job.handleNotesDelete(e, props.job)
                    if (deleted) {
                      setNotes([])
                    }
                  }}
                >
                  clear messages
                </Button>
              </Card>
            </Grid.Column>
            <Grid.Column width={13}>
              <Card fluid>
                <List>
                  {notes.map((note) => (
                    <MessageListItem key={note.rk} note={note} />
                  ))}
                </List>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Transition>
      </Grid>
    </Segment>
  )
}

export default Job
