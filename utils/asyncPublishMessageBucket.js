const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const pubSubClient = require('./gcpPubSubClient');

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
