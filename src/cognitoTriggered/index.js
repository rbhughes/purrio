exports.handler = async message => {
  console.log('============ Here we are in the cognito-triggered function')
  console.log(message)
  return message
}
