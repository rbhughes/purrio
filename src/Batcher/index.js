const Lambda = require('aws-sdk').Lambda

const lambdaInvoke = async (event) => {
  const { cred, name, args } = event
  const lamb = new Lambda(cred)
  let params = {
    FunctionName: name,
    Payload: JSON.stringify(args),
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
//
// selector: {
//   select: (a select statement from asset)
//   where:  (where clause based on user-defined filter)
//   order:  (order by clause required for TOP syntax)
// }
const batchSelector = (opts) => {
  let { count, chunk, selector } = opts
  const selectors = []
  const start = 1
  let x = 0
  x = start
  while ((count - x) * chunk >= 0) {
    chunk = x + chunk > count ? count - x + start : chunk
    const sql =
      `SELECT TOP ${chunk} START AT ${x} ` +
      `${selector.select.substring(7)} ` + // remove the 'SELECT'
      `${selector.where} ${selector.order};`
    selectors.push(sql)
    x += chunk
  }
  return selectors
}

// a single collector is either: database or filesystem
const enqueueCollectors = async (event) => {
  const results = []

  if (event.r_target === 'database') {
    const batches = batchSelector({
      count: event.q_count,
      chunk: event.q_chunk,
      selector: event.q_selector,
    })

    delete event.f_batcher
    delete event.q_chunk
    delete event.q_counter
    delete event.q_selector

    event.a_purr_org = event.m_purr_org
    event.a_purr_env = event.m_purr_env
    event.r_directive = 'selector'

    for (const [i, sql] of batches.entries()) {
      event.q_batched_selector = sql
      event.m_batched_num = `${i + 1} of ${batches.length}`
      let qj = await lambdaInvoke({
        cred: event.cred,
        name: event.f_enqueue,
        args: event,
      })
      results.push(qj)
    }
    return results
  } else {
    console.log('TODO !!!!!!!!!!!!!filesystem!!!!!!!!!!!!!')
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
