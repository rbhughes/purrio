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
  onCreateNote{
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

const handleFakeMessage = e => {
  console.log('HELLO FAKE MESSAGE')
  console.log(e)
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
          //const j = deserializeJobs([createdJob]) //assumes input is an array
          const updatedNotes = notes.concat(createdNote)
          setNotes(updatedNotes)
        }
      })
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }, [notes])

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
                    handleFakeMessage(props.job.id)
                  }}
                >
                  make fake message
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
