const schedule = require('node-schedule');
const axios = require('axios');
const subClient = require('../utils/gcpSubclient');

const asyncErrorLoggerWrapper = require('../utils/asyncErrorLoggerWrapper');
const asyncPublishMessageWebhook = require('../utils/asyncPublishMessageWebhook');

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
const sendWebhook = () => {
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

        const [response] = await subClient.pull(request).catch(err => {
            isOn = false;
            throw err;
        });
        const ackIds = [];
        for (const message of response.receivedMessages) {
            const data = JSON.parse(message.message.data);

            await axios
                .post(process.env.DISCORD_WEBHOOK, getJson(data))
                .catch(err => {
                    if (err.response.status === 429) {
                        asyncPublishMessageWebhook(data);
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
    const job = schedule.scheduleJob('*/3 * * * * *', () => {
        if (!isOn) sendWebhook();
    });
};
