const schedule = require('node-schedule');
const { v1 } = require('@google-cloud/pubsub');

const subClient = new v1.SubscriberClient({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncErrorLoggerWrapper = require('../api/routes/v1/public/asyncErrorLoggerWrapper');
const asyncPublishMessage_bucket = require('../api/routes/v1/public/asyncPublishMessage_bucket');

let isOn = false;

module.exports = app => {
    const logger = app.get('logger');
    const gcStorage = app.get('gcStorage');

    const deleteBucket = () => {
        asyncErrorLoggerWrapper(async () => {
            isOn = true;
            const formattedSubscription = subClient.subscriptionPath(
                process.env.PROJECT_ID,
                process.env.SUB_BUCKET,
            );

            const request = {
                subscription: formattedSubscription,
                maxMessages: 20,
            };

            const [response] = await subClient.pull(request);
            const ackIds = [];
            for (const message of response.receivedMessages) {
                console.log(message);
                const filename = JSON.parse(message.message.data).filename;
                await gcStorage
                    .bucket(process.env.BUCKET_NAME)
                    .file(filename)
                    .delete()
                    .catch(err => {
                        if (err.code === 429) {
                            asyncPublishMessage_bucket(filename, logger);
                        }
                    });
                ackIds.push(message.ackId);
            }

            if (ackIds.length !== 0) {
                const ackRequest = {
                    subscription: formattedSubscription,
                    ackIds: ackIds,
                };
                await subClient.acknowledge(ackRequest);
            }
            isOn = false;
        }, logger)();
    };

    const job = schedule.scheduleJob('*/5 * * * * *', () => {
        if (!isOn) deleteBucket();
    });
};
