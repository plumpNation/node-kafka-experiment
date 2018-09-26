#!/usr/bin/env node

const config = require('config')

const { Transform } = require('stream')

const {
  ProducerStream,
  ConsumerGroupStream,
} = require('kafka-node')

const resultProducer = new ProducerStream()

const consumerOptions = {
  kafkaHost: config.kafkaHost,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: [ 'roundrobin' ],
  asyncPush: false,
  id: 'consumer1',
  fromOffset: 'latest'
}

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic')

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,

  transform (message, encoding, callback) {
    console.log(`Received message ${message.value} transforming input`)

    callback(null, {
      topic: 'RebalanceTopic',
      messages: `You have been (${message.value}) made an example of`
    })
  }
})

consumerGroup.pipe(messageTransform).pipe(resultProducer)
