import React, { useState, useContext, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Button,
  Container,
  Divider,
  Form,
  Icon,
  Modal,
  Popup
} from 'semantic-ui-react'
import { AssetContext } from './AssetContext'
import { VendorContext } from './VendorContext'

// TODO: form validation--particularly or chunk <1?
const ModalJobForm = (props) => {
  //console.log('_________modalJobForm')
  //console.log(props)
  const defaultValues = {
    app: props.job.app,
    aux: props.job.aux,
    repo: props.job.repo,
    label: props.job.label,
    assets: props.job.assets
  }
  const [visible, setVisible] = useState(false)
  const [formDefaults, setFormDefaults] = useState(defaultValues)

  const assetList = useContext(AssetContext)
  const vendor = useContext(VendorContext)(props.job.app)

  const { control, register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: formDefaults
  })

  const watchRepo = watch('repo', props.repo)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets'
  })

  useEffect(() => {
    reset(formDefaults)
  }, [formDefaults, reset])

  const onSubmit = async (data) => {
    setFormDefaults(data)
    if (props.job.id) {
      await props.job.handleJobUpdate(data)
    } else {
      await props.job.handleJobCreate(data)
    }
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
            <Form.Field width={8}>
              <label>repo</label>
              <input name={'repo'} ref={register({})} />
            </Form.Field>
            <Form.Field width={4}>
              <label>{vendor.aux.label}</label>
              <input name={'aux'} ref={register({})} />
              {setValue('aux', vendor.aux.valueSetter(watchRepo))}
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
                  <Form.Field width={3}>
                    {index === 0 && <label>asset</label>}
                    <select
                      name={`assets[${index}].asset`}
                      ref={register({})}
                      defaultValue={field.asset}
                    >
                      {assetList.map((x) => {
                        return <option key={x.key}>{x.value}</option>
                      })}
                    </select>
                  </Form.Field>

                  <Form.Field width={4}>
                    {index === 0 && (
                      <>
                        <Popup trigger={<label>filter</label>} wide="very">
                          Insert some instructions for how to enter filter text
                        </Popup>
                      </>
                    )}

                    <input
                      placeholder={'use commas to separate multiple items'}
                      name={`assets[${index}].filter`}
                      ref={register({})}
                      defaultValue={field.filter}
                    />
                  </Form.Field>

                  <Form.Field width={1}>
                    {index === 0 && (
                      <>
                        <Popup trigger={<label>chunk</label>} wide="very">
                          something about chunk size
                        </Popup>
                      </>
                    )}
                    <input
                      placeholder={'chunk size'}
                      name={`assets[${index}].chunk`}
                      ref={register({})}
                      defaultValue={field.chunk}
                    />
                  </Form.Field>

                  <Form.Field width={3}>
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
                        Add Another Asset
                      </Button>
                    )}
                  </Form.Field>
                </Form.Group>
              </Container>
            )
          })}
          <Divider hidden />

          <Button type="submit">Save</Button>
          <Button
            onClick={() => {
              //reset()
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
