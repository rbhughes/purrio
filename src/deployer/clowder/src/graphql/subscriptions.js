export const onCreateJob = `subscription OnCreateJob {
  onCreateJob{
    id
    rk
    app
    assets
    aux
    label
    repo
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
    asset
    message
    modified
  }
}`
