const schedule = require('node-schedule');
const { v1 } = require('@google-cloud/pubsub');

const subClient = new v1.SubscriberClient({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncErrorLoggerWrapper = require('../utils/asyncErrorLoggerWrapper');
const asyncPublishMessageBucket = require('../utils/asyncPublishMessageBucket');
const gcStorage = require('../utils/gcStorage');

let isOn = false;
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
            const filename = JSON.parse(message.message.data).filename;
            await gcStorage
                .bucket(process.env.BUCKET_NAME)
                .file(filename)
                .delete()
                .catch(err => {
                    if (err.code === 429) {
                        asyncPublishMessageBucket(filename);
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
    })();
};
module.exports = () => {
    const job = schedule.scheduleJob('*/5 * * * * *', () => {
        if (!isOn) deleteBucket();
    });
};
