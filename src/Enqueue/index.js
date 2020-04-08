const AWS = require('aws-sdk')

const initSQS = async () => {
  try {
    return new AWS.SQS({
      apiVersion: '2012-11-05',
      region: process.env.QUEUE_REGION,
    })
  } catch (error) {
    console.error(error)
  }
}

// set the org and env as attributes but drop them from body
const parseEvent = (event) => {
  const attr = {
    purr_org: {
      DataType: 'String',
      StringValue: event.a_purr_org,
    },
    purr_env: {
      DataType: 'String',
      StringValue: event.a_purr_env,
    },
  }
  delete event.a_purr_org
  delete event.a_purr_env

  return { body: JSON.stringify(event), attr: attr }
}

exports.handler = async (event, context) => {
  let sqs = await initSQS()
  const { body, attr } = parseEvent(event)
  const params = {
    MessageBody: body,
    MessageAttributes: attr,
    QueueUrl: process.env.QUEUE_URL,
  }
  try {
    const res = await sqs.sendMessage(params).promise()
    return { Payload: res, event: event, context: context }
  } catch (err) {
    console.log(err)
    return { Payload: { err: err } }
  }
}
