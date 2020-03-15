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
  const attributes = {
    app: {
      DataType: 'String',
      StringValue: event.attr_app
    },
    target: {
      DataType: 'String',
      StringValue: event.attr_target
    },
    directive: {
      DataType: 'String',
      StringValue: event.attr_directive
    }
  }
  delete event.attr_app
  delete event.attr_target
  delete event.attr_directive
  const body = JSON.stringify(event)

  return { body: body, attributes: attributes }
}

exports.handler = async (event, context) => {
  let sqs = await initSQS()
  const { body, attributes } = parseEvent(event)
  const params = {
    MessageBody: body,
    MessageAttributes: attributes,
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
