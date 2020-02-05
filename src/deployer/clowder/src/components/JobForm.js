import React, { Component } from 'react'
import { Form, Modal, Button, Header, Icon } from 'semantic-ui-react'

class JobForm extends Component {
  emptyJob = () => {
    return {
      //owner: this.props.owner || '',
      //active: true,
      app: this.props.app.toUpperCase() || '',
      assets: [],
      label: '',
      repo: '',
      auxiliary: ''
      //status: 'PENDING'
    }
  }

  state = {
    action: this.props.action,
    modalOpen: false,
    job: this.props.action === 'create' ? this.emptyJob() : this.props.job
  }

  handleOpen = () => {
    let job = this.props.action === 'create' ? this.emptyJob() : this.props.job
    this.setState({ modalOpen: true, job: job })
  }

  handleClose = () => {
    this.setState({ modalOpen: false })
  }

  actionLabel = () => {
    return this.state.action === 'create' ? 'Create Job' : 'Edit'
  }

  handleChange = (e, { name, value, checked }) => {
    //console.log(`..... name=${name}  value=${value}  checked=${checked}`)

    // if GeoGraphix, auto-fill the auxiliary field
    if (name === 'repo' && this.state.job.app.match(/geographix/i)) {
      let m = value.match(/\\\\(.+?)\\/)
      let host = m ? m[1] : ''
      this.setState(state => {
        state.job.auxiliary = host
        return { job: state.job }
      })
    }

    this.setState(state => {
      if (value === undefined) {
        state.job[name] = checked ? checked : false
      } else {
        state.job[name] = value
      }
      return { job: state.job }
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.props.formSubmit(this.state.action, this.state.job)
    this.handleClose()
  }

  customAuxText = app => {
    switch (app) {
      case 'GEOGRAPHIX':
        return {
          label: 'server host',
          placeholder: `GeoGraphix server's hostname`
        }
      case 'KINGDOM':
        return { label: 'kingdom stuff', placeholder: 'Kingdom stuff' }
      case 'PETRA':
        return { label: 'petra stuff', placeholder: 'Petra stuff' }
      default:
        return { label: '', placeholder: '' }
    }
  }

  render() {
    return (
      <div>
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeOnDimmerClick={false}
          size="small"
        >
          <Header icon="browser" content={this.actionLabel()} />
          <Modal.Content>
            <Form>
              <Form.Group>
                <Form.Input
                  label="label"
                  placeholder="label"
                  name="label"
                  value={this.state.job.label}
                  onChange={this.handleChange}
                />
                <Form.Dropdown
                  label="application"
                  placeholder="pick app"
                  name="app"
                  selection
                  options={this.props.appChoice}
                  onChange={this.handleChange}
                  value={this.state.job.app}
                  disabled={true}
                />
                <Form.Input
                  label="owner"
                  name="owner"
                  value={this.props.owner}
                  disabled={true}
                />
              </Form.Group>
              <Form.Input
                label="repo"
                placeholder="path to project"
                name="repo"
                value={this.state.job.repo}
                onChange={this.handleChange}
              />
              <Form.Input
                label={this.customAuxText(this.state.job.app).label}
                placeholder={this.customAuxText(this.state.job.app).placeholder}
                name="auxiliary"
                value={this.state.job.auxiliary}
                onChange={this.handleChange}
              />
              <Form.Dropdown
                label="assets"
                placeholder="assets"
                name="assets"
                multiple
                selection
                options={this.props.assetChoice}
                onChange={this.handleChange}
                value={this.state.job.assets}
              />
              <Form.Checkbox
                label="active?"
                name="active"
                defaultChecked
                fitted
                toggle
                onChange={this.handleChange}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.handleClose} inverted>
              <Icon name="checkmark" /> Cancel
            </Button>
            <Button color="green" onClick={this.handleSubmit} inverted>
              <Icon name="checkmark" /> Save
            </Button>
          </Modal.Actions>
        </Modal>
        <Button onClick={this.handleOpen}>{this.actionLabel()}</Button>
      </div>
    )
  }
}

export default JobForm
