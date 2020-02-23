import React, { useState, useContext } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Button,
  Container,
  Divider,
  Form,
  Icon,
  Modal
} from 'semantic-ui-react'
import { AssetContext } from './AssetContext'
import { VendorContext } from './VendorContext'

/*
const setFormHeader = app => {
  const vendors = useContext(VendorContext)
  return (
    <Modal.Header>
      <Icon name="vendors[app].icon" />
      {vendors[app].longName}
    </Modal.Header>
  )
}
*/

// TODO: form validation?
const ModalJobForm = props => {
  //console.log('----------ModalClumpForm -- props-----------')
  //console.log(props)

  const [visible, setVisible] = useState(false)

  const assetList = useContext(AssetContext)
  const vendor = useContext(VendorContext)(props.job.app)

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      app: props.job.app,
      repo: props.job.repo,
      label: props.job.label,
      assets: props.job.assets
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets'
  })

  const onSubmit = data => {
    console.log('MODAL FORM SUBMITTED')
    props.job.handleFormSubmit(data)
    setVisible(!visible)
  }

  //console.log('______mcf props_____')
  //console.log(props)

  // https://react-hook-form.com/api#useFieldArray
  return (
    <Modal
      open={visible}
      size="large"
      trigger={
        <Button
          onClick={() => {
            setVisible(!visible)
          }}
        >
          {props.job.id ? 'Edit' : 'New Job'}
        </Button>
      }
    >
      <Modal.Header>
        <Icon name={vendor.icon} />
        {vendor.longName}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>{vendor.formInstructions}</Modal.Description>
      </Modal.Content>

      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <input
              name={'app'}
              ref={register({})}
              value={props.job.app}
              hidden
              readOnly
            />
            <Form.Field width={12}>
              <label>repo</label>
              <input name={'repo'} ref={register({})} />
            </Form.Field>
            <Form.Field width={4}>
              <label>label</label>
              <input name={'label'} ref={register({})} />
            </Form.Field>
          </Form.Group>

          {/*
          <Divider hidden />
          <Divider hidden />
          <Divider>Asset Collection</Divider>
          <Divider hidden />
          */}
          <Divider hidden />

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
          <Divider hidden />

          <Button type="submit">Submit</Button>
          <Button
            onClick={() => {
              setVisible(!visible)
            }}
          >
            Cancel
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default ModalJobForm
