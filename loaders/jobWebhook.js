const schedule = require('node-schedule');
const axios = require('axios');
const { v1 } = require('@google-cloud/pubsub');
const subClient = new v1.SubscriberClient({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncErrorLoggerWrapper = require('../api/routes/v1/public/asyncErrorLoggerWrapper');

const getJson = data => {
    return {
        embeds: [
            {
                author: {
                    name: data.name,
                },
                description: data.description,
                timestamp: data.timestamp,
            },
        ],
        username: data.username,
        avatar_url: data.avatar_url,
    };
};

module.exports = app => {
    const logger = app.get('logger');

    const webhook = () => {
        asyncErrorLoggerWrapper(async () => {
            const formattedSubscription = subClient.subscriptionPath(
                process.env.PROJECT_ID,
                process.env.SUB_WEBHOOK,
            );

            const request = {
                subscription: formattedSubscription,
                maxMessages: 3,
            };

            const [response] = await subClient.pull(request);
            const ackIds = [];
            for (const message of response.receivedMessages) {
                const dataJSON = getJson(JSON.parse(message.message.data));
                await axios
                    .post(process.env.DISCORD_WEBHOOK, dataJSON)
                    .catch(() => {});
                ackIds.push(message.ackId);
            }

            if (ackIds.length !== 0) {
                const ackRequest = {
                    subscription: formattedSubscription,
                    ackIds: ackIds,
                };

                await subClient.acknowledge(ackRequest);
            }
        }, logger)();
    };

    const job = schedule.scheduleJob('*/1 * * * * *', webhook);
};
