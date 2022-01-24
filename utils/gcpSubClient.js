const { v1 } = require('@google-cloud/pubsub');

const subClient = new v1.SubscriberClient({
    keyFilename: process.env.KEY_FILENAME,
});

module.exports = subClient;
