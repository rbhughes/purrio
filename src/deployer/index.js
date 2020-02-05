const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const cfnCR = require('cfn-custom-resource')
const AWS = require('aws-sdk')
const glob = require('glob')

const s3 = new AWS.S3()
exports.handler = async message => {
  console.log(message)
  try {
    const tmpDir = `/tmp/clowder${process.pid}`

    const npm = 'npm'
    await spawnPromise('rm', ['-rf', tmpDir])
    await spawnPromise('cp', ['-R', 'clowder/', tmpDir])
    await spawnPromise(
      npm,
      [
        '--production',
        '--no-progress',
        '--loglevel=error',
        '--cache',
        path.join('/tmp', 'npm'),
        '--userconfig',
        path.join('/tmp', 'npmrc'),
        'install'
      ],
      { cwd: tmpDir }
    )
    await spawnPromise(
      npm,
      [
        '--production',
        '--no-progress',
        '--loglevel=error',
        '--cache',
        path.join('/tmp', 'npm'),
        '--userconfig',
        path.join('/tmp', 'npmrc'),
        'run',
        'build'
      ],
      { cwd: tmpDir }
    )

    // delete pre-existing bucket contents
    let bucketItems = await s3
      .listObjects({ Bucket: process.env.BUCKET_NAME })
      .promise()
    const killParams = {
      Bucket: process.env.BUCKET_NAME,
      Delete: { Objects: [] }
    }
    if (bucketItems.Contents.length > 0) {
      for (const o of bucketItems.Contents) {
        killParams.Delete.Objects.push({ Key: o.Key })
      }
      const deletedBucketItems = await s3.deleteObjects(killParams).promise()
      console.log(deletedBucketItems)
    }

    const builtPaths = glob.sync(`${tmpDir}/build/**/*`)
    console.log(builtPaths)

    const uploads = []
    builtPaths.forEach(async path => {
      if (!fs.lstatSync(path).isFile()) {
        return
      }

      // if manually copied, AWS picks these:
      // favicon.ico = image/vnd.microsoft.icon || image/x-icon
      // .chunk.css.map = application/json || binary/octet-stream
      const mimeType = mime.lookup(path) || 'application/octet-stream'

      // 2020-01-01
      // The promisified version of fs.readFile was silently failing
      // to include files >~ 1 MB, Not sure why. Adding a setTimeout
      // of 5 seconds prior to cfnCR.send allowed it to finish (?!)
      // TODO: revisit promisified fs.readFile maybe?
      //const fileHandle = await readFile(path)
      const fileHandle = fs.readFileSync(path)
      const key = path.replace(`${tmpDir}/build/`, '')

      const params = {
        ACL: 'public-read',
        ContentType: mimeType,
        Body: fileHandle,
        Bucket: process.env.BUCKET_NAME,
        Key: key
      }
      //const s3Response = await s3.putObject(params).promise()
      //const res = await s3.upload(params).promise()
      //console.log(res)
      uploads.push(s3.upload(params).promise())
    })

    const res = await Promise.all(uploads)
    console.log(res)

    await cfnCR.sendSuccess('deployFrontEnd', {}, message)
  } catch (error) {
    console.log(error)
    await cfnCR.sendFailure(error.message, message)
  }
}

function spawnPromise(command, args, options) {
  console.log(`spawnPromise ===> \`${command} '${args.join("' '")}'\`...`)

  options = options || {}

  if (!options.env) {
    options.env = {}
  }

  Object.assign(options.env, process.env)

  return new Promise((resolve, reject) => {
    execFile(command, args, options, (err, stdout, stderr) => {
      if (stdout) {
        console.log('STDOUT:')
        console.log(stdout)
      }
      if (stderr) {
        console.log('STDERR:')
        console.log(stderr)
      }

      if (err) {
        err.stdout = stdout
        err.stderr = stderr
        reject(err)
      } else {
        resolve({ stdout: stdout, stderr: stderr })
      }
    })
  })
}
