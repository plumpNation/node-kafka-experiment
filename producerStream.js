const config = require('config')

const { Throttle } = require('stream-throttle')
const { Transform } = require('stream')
const { ProducerStream } = require('kafka-node')

const producer = new ProducerStream({
  kafkaClient: config.kafkaHost,
})

let chunk = '';
let chunkExcess = '';

const stdinTransform = new Transform({
  objectMode: true,
  decodeStrings: true,

  transform (text, encoding, callback) {
    if (chunkExcess) {
      chunk = chunkExcess
      chunkExcess = ''
    }

    text = text.toString();

    if (text.includes('\n')) {
      const parts = text.split('\n')

      chunk += parts[0]
      chunkExcess = parts[1]

      console.log(chunk)

      callback(null, {
        topic: 'ExampleTopic',
        messages: chunk
      })

    } else {
      chunk += text

      callback(null)
    }
  }
})

const throttle = new Throttle({ rate: 200 })

process.stdin.setEncoding('utf8')
process.stdin.pipe(throttle).pipe(stdinTransform).pipe(producer)
