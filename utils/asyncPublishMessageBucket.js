const { PubSub } = require('@google-cloud/pubsub');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');

const pubSubClient = new PubSub({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncPublishMessageBucket = filename => {
    asyncErrorLoggerWrapper(async () => {
        const data = {
            filename: filename,
        };
        const dataBuffer = Buffer.from(JSON.stringify(data));

        await pubSubClient.topic(process.env.TOPIC_BUCKET).publish(dataBuffer);
    })();
};

module.exports = asyncPublishMessageBucket;
