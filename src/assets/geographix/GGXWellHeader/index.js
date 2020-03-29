const counter = () => {
  return 'SELECT COUNT(*) as count FROM well;'
}

const selector = () => {
  return 'SELECT uwi, well_name, well_number, legal_survey_type, operator,\
  surface_latitude, surface_longitude FROM well ORDER BY uwi;'
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
