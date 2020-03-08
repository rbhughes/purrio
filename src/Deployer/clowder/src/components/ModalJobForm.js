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

// TODO: form validation?
const ModalJobForm = props => {
  const [visible, setVisible] = useState(false)

  const assetList = useContext(AssetContext)
  const vendor = useContext(VendorContext)(props.job.app)

  const { control, register, handleSubmit, reset } = useForm({
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
    if (props.job.id) {
      console.log('THERE IS AN ID: ' + props.job.id)
      props.job.handleJobUpdate(data)
    } else {
      console.log('NO ID !!!')
      props.job.handleJobCreate(data)
    }
    reset()
    setVisible(!visible)
  }

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
          {props.job.id ? 'Edit' : 'Create Job'}
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
              reset()
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
