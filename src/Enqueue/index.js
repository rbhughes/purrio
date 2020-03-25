const AWS = require('aws-sdk')

const initSQS = async () => {
  try {
    return new AWS.SQS({
      apiVersion: '2012-11-05',
      region: process.env.QUEUE_REGION
    })
  } catch (error) {
    console.error(error)
  }
}

const parseEvent = event => {
  const attr = {
    app: {
      DataType: 'String',
      StringValue: event.a_app
    },
    target: {
      DataType: 'String',
      StringValue: event.a_target
    },
    directive: {
      DataType: 'String',
      StringValue: event.a_directive
    },
    org: {
      DataType: 'String',
      StringValue: event.a_org
    },
    env: {
      DataType: 'String',
      StringValue: event.a_env
    }
  }

  delete event.a_app
  delete event.a_target
  delete event.a_directive
  delete event.a_org
  delete event.a_env

  const body = JSON.stringify(event)

  return { body: body, attr: attr }
}

exports.handler = async (event, context) => {
  let sqs = await initSQS()
  const { body, attr } = parseEvent(event)
  const params = {
    MessageBody: body,
    MessageAttributes: attr,
    QueueUrl: process.env.QUEUE_URL
  }
  try {
    const res = await sqs.sendMessage(params).promise()
    return { Payload: res, event: event, context: context }
  } catch (err) {
    console.log(err)
    return { Payload: { err: err } }
  }
}
