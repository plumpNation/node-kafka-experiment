const {
  Producer,
  KafkaClient,
  KeyedMessage,
} = require('kafka-node')

const client = new KafkaClient({kafkaHost: 'localhost:9092'})
const producer = new Producer(client)

const km = new KeyedMessage('foo', 'bar')

const payloads = [
  { topic: 'topic1', messages: 'hi' },
  { topic: 'topic2', messages: ['hello', 'world', km] }
]

producer.on('ready', function () {

  setInterval(() => {
    producer.send(payloads, function (err, data) {
      if (err) return console.error(err)

      console.log(data)
    })
  }, 2000)
})

producer.on('error', function (err) {})
