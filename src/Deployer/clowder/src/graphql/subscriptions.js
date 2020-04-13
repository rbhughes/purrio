export const onCreateJob = `subscription OnCreateJob {
  onCreateJob{
    id
    rk
    app
    assets
    aux
    label
    repo
    modified
  }
}`

export const onUpdateJob = `subscription OnUpdateJob {
  onUpdateJob{
    id
    rk
    app
    assets
    aux
    label
    repo
    modified
  }
}`

export const onDeleteJob = `subscription OnDeleteJob {
  onDeleteJob{
    id
    rk
  }
}`

export const onCreateNote = `subscription OnCreateNote {
  onCreateNote {
    id
    rk
    message
    modified
  }
}`
