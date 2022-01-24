const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub({
    keyFilename: process.env.KEY_FILENAME,
});

module.exports = pubSubClient;
