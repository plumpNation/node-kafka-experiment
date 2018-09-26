const config = require('config')

const {
  KafkaClient,
  Offset,
} = require('kafka-node')

const client = new KafkaClient()
const offset = new Offset(client)

offset.fetch([
  {
    topic: 'topic2',
    time: new Date('2017'),
  }
], (err, data) => {
  if (err) return console.error(err)

  console.log(data)
});
