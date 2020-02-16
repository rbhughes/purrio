import React, { useContext } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Button,
  Container,
  Modal,
  Header,
  Form,
  Divider
} from 'semantic-ui-react'
import { AssetContext } from './AssetContext'

// TODO: add validation?
const ModalClumpForm = props => {
  //console.log('----------ModalClumpForm -- props-----------')
  //console.log(props)

  const assetList = useContext(AssetContext)
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      app: props.clump.app,
      repo: props.clump.repo,
      label: props.clump.label,
      assets: props.clump.assets
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets'
  })

  const onSubmit = data => props.clump.submission(data)

  // https://react-hook-form.com/api#useFieldArray
  return (
    <Modal trigger={<Button>Edit</Button>}>
      <Modal.Header>{props.clump.id}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Create or Edit</Header>
        </Modal.Description>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field>
              <input
                name={'app'}
                ref={register({})}
                value={props.clump.app}
                hidden
                readOnly
              />
            </Form.Field>
            <Form.Field>
              <input name={'repo'} ref={register({})} />
            </Form.Field>
            <Form.Field>
              <input name={'label'} ref={register({})} />
            </Form.Field>
          </Form.Group>

          <Divider />

          {fields.map((field, index) => {
            return (
              <Container key={field.id} fluid>
                <Form.Group widths="equal">
                  <Form.Field>
                    {index === 0 && <label>asset</label>}
                    <select
                      name={`assets[${index}].asset`}
                      ref={register({})}
                      defaultValue={field.asset}
                    >
                      {assetList.map(x => {
                        return <option key={x.key}>{x.value}</option>
                      })}
                    </select>
                  </Form.Field>
                  <Form.Field>
                    {index === 0 && <label>filter</label>}
                    <input
                      name={`assets[${index}].filter`}
                      ref={register({})}
                      defaultValue={field.filter}
                    />
                  </Form.Field>

                  <Form.Field>
                    {index === 0 && <label>&nbsp;</label>}
                    <Button
                      type="button"
                      disabled={fields.length < 2}
                      onClick={() => {
                        remove(index)
                      }}
                    >
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

export default ModalClumpForm
