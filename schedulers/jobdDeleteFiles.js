const schedule = require('node-schedule');
const asyncErrorLoggerWrapper = require('../utils/asyncErrorLoggerWrapper');
const asyncPublishMessageBucket = require('../utils/asyncPublishMessageBucket');
const gcpStorage = require('../utils/gcpStorage');
const subClient = require('../utils/gcpSubClient');

let isOn = false;
const deleteFiles = () => {
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

        const [response] = await subClient.pull(request).catch(err => {
            isOn = false;
            throw err;
        });
        const ackIds = [];
        for (const message of response.receivedMessages) {
            const filename = JSON.parse(message.message.data).filename;
            await gcpStorage
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
            await subClient.acknowledge(ackRequest).catch(err => {
                isOn = false;
                throw err;
            });
        }

        isOn = false;
    })();
};
module.exports = () => {
    const job = schedule.scheduleJob('*/5 * * * * *', () => {
        if (!isOn) deleteFiles();
    });
};
