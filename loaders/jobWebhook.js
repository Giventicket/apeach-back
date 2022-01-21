const schedule = require('node-schedule');
const axios = require('axios');
const { v1 } = require('@google-cloud/pubsub');
const subClient = new v1.SubscriberClient({
    keyFilename: process.env.KEY_FILENAME,
});

const asyncErrorLoggerWrapper = require('../api/routes/v1/public/asyncErrorLoggerWrapper');
const asyncPublishMessage_webhook = require('../api/routes/v1/public/asyncPublishMessage_webhook');

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

let isOn = false;

module.exports = app => {
    const logger = app.get('logger');

    const webhook = () => {
        isOn = true;
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
                const data = JSON.parse(message.message.data);

                await axios
                    .post(process.env.DISCORD_WEBHOOK, getJson(data))
                    .catch(err => {
                        if (err.response.status === 429) {
                            asyncPublishMessage_webhook(data, logger);
                        }
                    });
                ackIds.push(message.ackId);
            }
            if (ackIds.length !== 0) {
                const ackRequest = {
                    subscription: formattedSubscription,
                    ackIds: ackIds,
                };
                const result = await subClient.acknowledge(ackRequest);
                console.log('end ', response.receivedMessages[0].message);
            }
            isOn = false;
        }, logger)();
    };

    const job = schedule.scheduleJob('*/3 * * * * *', () => {
        if (!isOn) webhook();
    });
};
