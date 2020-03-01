export const listJobsByApp = `query ListJobsByApp($app: App) {
  listJobsByApp(app: $app){
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

export const listNotesByPKey = `query ListNotesByPKey($id: ID) {
  listNotesByPKey(id: $id) {
    id
    rk
    asset
    message
    modified
  }
}`
