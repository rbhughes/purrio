import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Button,
  Container,
  Modal,
  Header,
  Form,
  Divider,
  Input
} from 'semantic-ui-react'

// https://github.com/react-hook-form/react-hook-form/issues/85
// https://codesandbox.io/s/semantic-ui-react-form-hooks-vnyjh?from-embed
const ModalJobForm = props => {
  const {
    control,
    register,
    handleSubmit,
    errors,
    setValue,
    triggerValidation
  } = useForm({
    defaultValues: {
      app: props.job.app,
      label: props.job.label,
      repo: props.job.repo,
      assets: [{ asset: 'WELL_HEADER', filter: 'useFieldArray' }]
    }
  })

  useEffect(() => {
    register({ name: 'label' }, { required: true })
    register({ name: 'repo' }, { required: true })
    register({ name: 'assets' }, { required: true })
  }, [register])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets'
  })

  /////////////
  /////////////
  const onSubmit = data => console.log(data)
  /////////////
  /////////////

  if (errors.length > 0) {
    console.error(errors)
  }
  return (
    <Modal trigger={<Button>Edit</Button>}>
      <Modal.Header>
        {props.job.id}-{props.job.rk}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Create or Edit</Header>
        </Modal.Description>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Input
              defaultValue={props.job.repo}
              label="repo"
              type="text"
              placeholder="repo"
              name="repo"
              fluid
              onChange={async (e, { name, value }) => {
                setValue(name, value)
                await triggerValidation({ name })
              }}
              error={errors.repo ? true : false}
            />
            <Form.Input
              defaultValue={props.job.label}
              label="label"
              type="text"
              placeholder="label"
              name="label"
              fluid
              onChange={async (e, { name, value }) => {
                setValue(name, value)
                await triggerValidation({ name })
              }}
              error={errors.label ? true : false}
            />
          </Form.Group>

          <Divider />

          {fields.map((item, index) => {
            return (
              <Container key={item.id} fluid>
                <Form.Group widths="equal">
                  <Form.Field>
                    {index === 0 && <label>asset</label>}
                    <select name={`assets[${index}].asset`} ref={register}>
                      {props.assets.map(x => {
                        return <option key={x.key}>{x.value}</option>
                      })}
                    </select>
                  </Form.Field>
                  <Form.Field>
                    {index === 0 && <label>filter</label>}
                    <Input
                      name={`assets[${index}].filter`}
                      ref={register}
                      placeholder="(leave blank top 10)"
                    />
                  </Form.Field>

                  <Form.Field>
                    {index === 0 && <label>&nbsp;</label>}
                    <Button type="button" onClick={() => remove(index)}>
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

export default ModalJobForm
