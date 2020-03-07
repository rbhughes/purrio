const AWS = require('aws-sdk')

//TODO: maybe send the kittybox FunctionName as an event arg?

const kittyBoxLambda = async (cred, args) => {
  const myLambda = new AWS.Lambda(cred)
  let params = {
    FunctionName: '$_PORG-KittyBox-lambda-$_ENV',
    Payload: JSON.stringify(args)
  }
  let res = await myLambda.invoke(params).promise()
  return JSON.parse(res.Payload)
}


// Given total and chunk size, define a series of SQL queries bounded by SQLAnywhere's
// 'SELECT TOP X START AT Y' syntax. Example:
// total: 1137,
// chunk: 500:
//   sql: 'select * from well order by uwi'
//
//  'SELECT TOP 500 START AT 1 * from well order by uwi',
//  'SELECT TOP 500 START AT 501 * from well order by uwi',
//  'SELECT TOP 137 START AT 1001 * from well order by uwi' ]
const batchSelector = ({ total, chunk, sql }) => {
  const selectors = []
  const start = 1
  let x = 0
  x = start
  let sqlTail = sql.substring(7) // removes 'SELECT '
  while ((total - x) * chunk >= 0) {
    chunk = x + chunk > total ? total - x + start : chunk
    selectors.push(\`SELECT TOP \${chunk} START AT \${x} \${sqlTail}\`)
    x += chunk
  }
  return selectors
}

exports.handler = async (event, context) => {
  try {
    // obviously a work in progress
    const args = {
      app: 'geographix',
      asset: 'directional_survey',
      method: 'selector',
      sent: { db_params: { fake: 'fake db_params' }, label: 'fake_label' }
    }

    const { lambdaName, lambdaArgs } = await kittyBoxLambda(event.cred, args)
    const batches = batchSelector(event)
    return { batches: batches, lambdaName: lambdaName, lambdaArgs: lambdaArgs }
  } catch (error) {
    return error
  }
}
