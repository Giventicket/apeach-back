const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const pubSubClient = require('./gcpPubSubClient');

const asyncPublishMessageWebhook = data => {
    asyncErrorLoggerWrapper(async () => {
        const dataBuffer = Buffer.from(JSON.stringify(data));

        await pubSubClient.topic(process.env.TOPIC_WEBHOOK).publish(dataBuffer);
    })();
};

module.exports = asyncPublishMessageWebhook;
