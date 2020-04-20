export const createJob = `mutation CreateJob($job: JobInput) {
  createJob(job: $job) {
    id
    rk
    app
    assets
    aux
    label
    repo
  }
}`

export const updateJob = `mutation UpdateJob($job: JobInput) {
  updateJob(job: $job) {
    id
    rk
    app
    assets
    aux
    label
    repo
  }
}`

export const deleteJob = `mutation DeleteJob($pair: KeyPair) {
  deleteJob(pair: $pair) {
    id
    rk
  }
}`

export const createNote = `mutation CreateNote($note: NoteInput ) {
  createNote(note: $note) {
    id
    rk
    cargo
  }
}`

export const batchDeleteNotes = `mutation BatchDeleteNotes($pairs: [KeyPair]) {
  batchDeleteNotes(pairs: $pairs) {
    id
    rk
    cargo
    modified
  }
}`
