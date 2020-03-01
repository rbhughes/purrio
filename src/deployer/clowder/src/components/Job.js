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
const hashify = require('../util').hashify

const listNotesByPKey = `query ListNotesByPKey($id: ID) {
  listNotesByPKey(id: $id) {
    id
    rk
    asset
    message
    modified
  }
}`

const onCreateNote = `subscription OnCreateNote {
  onCreateNote {
    id
    rk
    asset
    message
    modified
  }
}`

const createNote = `mutation CreateNote($note: NoteInput ) {
  createNote(note: $note) {
    id
    rk
    asset
    message
  }
}`

const batchDeleteNotes = `mutation BatchDeleteNotes($pairs: [KeyPair]) {
  batchDeleteNotes(pairs: $pairs) {
    id
    rk
    asset
    message
    modified
  }
}`

const MessageListItem = props => {
  return (
    <List.Item>
      {/*<Image avatar src="/images/avatar/small/rachel.png" />*/}
      <List.Content>
        <List.Header>{props.note.asset}</List.Header>
        <List.Description>{props.note.message}</List.Description>
      </List.Content>
    </List.Item>
  )
}

const handleFakeMessage = async job => {
  console.log(job)
  try {
    const fake = {
      id: job.id,
      rk: Date.now().toString(),
      asset: 'PRODUCTION',
      message: `${job.id} --- howdy from a fake message ${Date.now()}`
    }
    await API.graphql(graphqlOperation(createNote, { note: fake }))
  } catch (error) {
    console.error(error)
  }
}

const handleBatchDeleteNotes = async job => {
  try {
    let allNotes = await API.graphql(
      graphqlOperation(listNotesByPKey, { id: job.id })
    )
    const pairs = allNotes.data.listNotesByPKey.map(o => {
      return { id: o.id, rk: o.rk }
    })
    await API.graphql(graphqlOperation(batchDeleteNotes, { pairs: pairs }))
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

const Job = props => {
  const [notes, setNotes] = useState([])
  const [visible, setVisible] = useState(false)

  const fetchNotes = async id => {
    //setIsLoading(true)

    try {
      const dbNotes = await API.graphql(
        graphqlOperation(listNotesByPKey, { id: id })
      )
      //let jobs = deserializeJobs(dbJobs.data.listJobsByApp)
      let notez = dbNotes.data.listNotesByPKey
      //console.log('nnnnnnnnnnnnnn')
      //console.log(notez)

      setNotes(notez)
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
        graphqlOperation(onCreateNote)
      ).subscribe({
        next: res => {
          console.log('__________onCreateNote')
          const createdNote = res.value.data.onCreateNote
          if (props.job.id === createdNote.id) {
            const updatedNotes = notes.concat(createdNote)
            setNotes(updatedNotes)
          }
        }
      })
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [notes, props.job.id])

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
                onClick={() => {
                  props.job.handleJobDelete(props.job)
                }}
              >
                Delete
              </Button>
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
                <Button
                  onClick={() => {
                    handleFakeMessage(props.job)
                  }}
                >
                  make fake message
                </Button>
                <Button
                  onClick={() => {
                    let deleted = handleBatchDeleteNotes(props.job)
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
                  {notes.map(note => (
                    <MessageListItem key={hashify(note.rk)} note={note} />
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
