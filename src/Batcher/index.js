const Lambda = require('aws-sdk').Lambda

const lambdaInvoke = async event => {
  const { cred, name, args } = event
  const lamb = new Lambda(cred)
  let params = {
    FunctionName: name,
    Payload: JSON.stringify(args)
  }
  try {
    let res = await lamb.invoke(params).promise()
    let payload = JSON.parse(res.Payload)
    payload.lambda = name
    return payload
  } catch (error) {
    console.error(error)
  }
}

// Given total and chunk size, define a batch of SQL selects.
// The count is limited by SQLAnywhere's 'SELECT TOP X START AT Y' syntax.
// Example  (total: 1137, chunk: 500):
//   sql: 'select * from well order by uwi'
//
//  'SELECT TOP 500 START AT 1 * from well order by uwi',
//  'SELECT TOP 500 START AT 501 * from well order by uwi',
//  'SELECT TOP 137 START AT 1001 * from well order by uwi' ]
//const batchSelector = ({ q_total, q_chunk, q_counter }) => {
const batchSelector = (total, chunk, sql) => {
  const selectors = []
  const start = 1
  let x = 0
  x = start
  let sqlTail = sql.substring(7) // removes 'SELECT ' from string
  while ((total - x) * chunk >= 0) {
    chunk = x + chunk > total ? total - x + start : chunk
    selectors.push(`SELECT TOP ${chunk} START AT ${x} ${sqlTail}`)
    x += chunk
  }
  return selectors
}

// a single collector is either: database or filesystem
// q_count is provided by worker
const enqueueCollectors = async event => {
  const results = []

  if (event.r_target === 'database') {
    const batches = batchSelector(
      event.q_count,
      event.q_chunk,
      event.q_selector,
      event.q_filter
    )

    delete event.f_batcher
    delete event.q_chunk
    delete event.q_counter
    delete event.q_filter
    delete event.q_selector

    event.a_purr_org = event.m_purr_org
    event.a_purr_env = event.m_purr_env
    event.r_directive = 'selector'

    for (const sql of batches) {
      event.q_batched_selector = sql
      let i = await lambdaInvoke({
        cred: event.cred,
        name: event.f_enqueue,
        args: event
      })
      console.log(i)
      results.push(i)
    }
    return results
  } else {
    console.log('!!!!!!!!!!!!!filesystem!!!!!!!!!!!!!')
  }
}

exports.handler = async (event, context) => {
  try {
    let results = await enqueueCollectors(event)

    return { event: event, results: results }
  } catch (error) {
    return error
  }
}
