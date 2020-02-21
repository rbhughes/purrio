import React, { useState } from 'react'
import {
  Button,
  Card,
  Grid,
  Image,
  Label,
  List,
  Segment,
  Transition
} from 'semantic-ui-react'

import ModalClumpForm from './ModalClumpForm'

const Clump = props => {
  //console.log('----------Clump -- props-----------')
  //console.log(props)

  const [visible, setVisible] = useState(false)

  return (
    <Segment>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <List divided horizontal size="huge">
              <List.Item>
                <code>{props.clump.repo}</code>
              </List.Item>
              <List.Item>
                <Label tag>{props.clump.label}</Label>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <Button.Group>
              <ModalClumpForm clump={props.clump} />
              <Button
                content={visible ? 'Hide' : 'Show'}
                onClick={() => {
                  setVisible(!visible)
                }}
              />
              <Button
                onClick={() => {
                  props.clump.handleClumpDelete(props.clump)
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

export default Clump
