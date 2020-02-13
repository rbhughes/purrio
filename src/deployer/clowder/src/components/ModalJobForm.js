import React, { useEffect, useContext } from 'react'
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

// https://github.com/react-hook-form/react-hook-form/issues/85
// https://codesandbox.io/s/semantic-ui-react-form-hooks-vnyjh?from-embed
// asset must use <select>, not semantic's <Dropdown>
// filter must use <input>, not semantic's <Input>
const ModalJobForm = props => {
  const assetList = useContext(AssetContext)
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
      //assets: [{ asset: props.job.assets[0].name, filter: useFieldArray }]
      assets: [{ asset: '', filter: '*' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets'
  })

  useEffect(() => {
    register({ name: 'label' }, { required: true })
    register({ name: 'repo' }, { required: true })
    register({ name: 'assets' }, { required: true })
  }, [register])

  /////////////

  const formatSubmission = data => {
    console.log(data)
  }
  /////////////
  const onSubmit = data => formatSubmission(data)
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

          {fields.map((field, index) => {
            return (
              <Container key={field.id} fluid>
                <Form.Group widths="equal">
                  <Form.Field>
                    {index === 0 && <label>asset</label>}
                    <select name={`assets[${index}].asset`} ref={register}>
                      {assetList.map(x => {
                        return <option key={x.key}>{x.value}</option>
                      })}
                    </select>
                  </Form.Field>
                  <Form.Field>
                    {index === 0 && <label>filter</label>}
                    <input name={`assets[${index}].filter`} ref={register} />
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
