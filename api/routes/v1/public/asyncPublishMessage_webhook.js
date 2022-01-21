const { PubSub } = require('@google-cloud/pubsub');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');

const pubSubClient = new PubSub({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncPublishMessage_webhook = (data, logger) => {
    asyncErrorLoggerWrapper(async () => {
        const dataBuffer = Buffer.from(JSON.stringify(data));

        await pubSubClient.topic(process.env.TOPIC_WEBHOOK).publish(dataBuffer);
    }, logger)();
};

module.exports = asyncPublishMessage_webhook;
