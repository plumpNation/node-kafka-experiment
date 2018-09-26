const config = require('config')

const {
  Consumer,
  KafkaClient,
} = require('kafka-node')

const client = new KafkaClient({ kafkaHost: config.kafkaHost })

const consumer = new Consumer(
  client,
  [
      { topic: 'topic1' },
      { topic: 'topic2' }
  ],
  {
      autoCommit: false
  }
)

consumer.on('message', function (message) {
  console.log(message);
});

process.on('SIGINT', () => {
  consumer.commit((err, data) => {
    if (err) return console.error(err)

    console.log(data)
  })

  console.log('I died')
  process.exit();
})
