const counter = () => {
  return 'SELECT COUNT(*) as count FROM well;'
}

const selector = () => {
  return 'SELECT * FROM well;'
}

exports.handler = async (event, context) => {
  //TODO: is SQL override safe or desirable?
  // supplied sql as an arg overrides the directive
  let o = {
    label: event.label,
    db_params: event.db_params,
    sql: event.sql ? event.sql : null
  }

  if (event.directive === 'counter') {
    o.sql = counter()
  } else if (event.directive === 'selector') {
    o.sql = selector()
  }
  return o
}
