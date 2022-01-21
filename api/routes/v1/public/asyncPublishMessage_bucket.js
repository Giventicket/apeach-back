const { PubSub } = require('@google-cloud/pubsub');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');

const pubSubClient = new PubSub({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncPublishMessage_bucket = (filename, logger) => {
    asyncErrorLoggerWrapper(async () => {
        const data = {
            filename: filename,
        };
        const dataBuffer = Buffer.from(JSON.stringify(data));

        console.log(pubSubClient);
        await pubSubClient.topic(process.env.TOPIC_BUCKET).publish(dataBuffer);
    }, logger)();
};

module.exports = asyncPublishMessage_bucket;
