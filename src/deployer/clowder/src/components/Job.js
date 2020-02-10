import React, { useState } from 'react'
import {
  Button,
  Card,
  Grid,
  Image,
  Label,
  Segment,
  Transition,
  List
} from 'semantic-ui-react'

import ModalJobForm from './ModalJobForm'

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
              <ModalJobForm job={props.job} assets={props.assets} />
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

export default Job
