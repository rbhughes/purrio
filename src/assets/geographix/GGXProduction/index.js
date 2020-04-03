const counter = () => {
  return 'SELECT COUNT(*) as count FROM well;'
}

const selector = () => {
  return `select 'TBD GGXProduction'`
}

const steps = () => {
  return [{ query: 'selector' }, { publish: 'stdout' }]
}

exports.handler = async (event, context) => {
  const { chunk = 1000 } = event
  return {
    chunk: chunk,
    counter: counter(),
    selector: selector(),
    steps: steps()
  }
}
