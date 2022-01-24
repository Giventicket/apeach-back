const schedule = require('node-schedule');
const subClient = require('../utils/gcpSubclient');

const asyncErrorLoggerWrapper = require('../utils/asyncErrorLoggerWrapper');
const asyncPublishMessageBucket = require('../utils/asyncPublishMessageBucket');
const gcpStorage = require('../utils/gcpStorage');

let isOn = false;
const deleteAudios = () => {
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
            await subClient.acknowledge(ackRequest);
        }

        isOn = false;
    })();
};
module.exports = () => {
    const job = schedule.scheduleJob('*/5 * * * * *', () => {
        if (!isOn) deleteAudios();
    });
};
