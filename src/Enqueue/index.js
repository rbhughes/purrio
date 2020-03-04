const AWS = require('aws-sdk')
const SQS_URL = '$QUEUE_URL'
const SQS_REGION = 'us-east-2'

const initSQS = async () => {
  try {
    return new AWS.SQS({
      apiVersion: '2012-11-05',
      region: SQS_REGION
    })
  } catch (error) {
    console.error(error)
  }
}

const formatForQueue = o => {
  console.log(o)
  return JSON.stringify(o)
}

exports.handler = async (event, context) => {
  console.log('^^^^^^^^^')
  console.log(event)
  console.log('^^^^^^^^^')

  const attr_app = event.attr_app
  delete event.attr_app
  const attr_target = event.attr_target
  delete event.attr_target
  const attr_directive = event.attr_directive
  delete event.attr_directive
  const attr_porg = event.attr_porg
  delete event.attr_porg

  let sqs = await initSQS()

  const params = {
    //MessageBody: JSON.stringify(event.job),
    MessageBody: formatForQueue(event),
    MessageAttributes: {
      app: {
        DataType: 'String',
        StringValue: attr_app
      },
      target: {
        DataType: 'String',
        StringValue: attr_target
      },
      directive: {
        DataType: 'String',
        StringValue: attr_directive
      },
      porg: {
        DataType: 'String',
        StringValue: attr_porg
      }
    },
    QueueUrl: SQS_URL
  }

  try {
    let res = await sqs.sendMessage(params).promise()
    return { Payload: res, event: event, context: context }
  } catch (err) {
    console.log(err)
    return { Payload: { err: err } }
  }
}
