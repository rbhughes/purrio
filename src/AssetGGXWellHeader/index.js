const counter = () => {
  return 'SELECT COUNT(*) as count FROM well;'
}

const selector = () => {
  return 'SELECT * FROM well;'
}

exports.handler = async (event, context) => {
  const { chunk = 100 } = event
  return { chunk: chunk, counter: counter(), selector: selector() }
}
