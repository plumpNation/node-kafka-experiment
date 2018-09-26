const kafka = require('kafka-node')
const client = new kafka.Client()
const offset = new kafka.Offset(client)

offset.fetch([
    {
      topic: 'topic2',
      time: new Date('2017'),
    }
], (err, data) => {
  if (err) return console.error(err)

  console.log(data)
});
