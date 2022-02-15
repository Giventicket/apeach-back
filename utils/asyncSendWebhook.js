const axios = require('axios');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const asyncPublishMessageWebhook = require('./asyncPublishMessageWebhook');

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

const asyncSendWebhook = (description, timestamp, name) => {
    asyncErrorLoggerWrapper(async () => {
        const data = {
            name,
            description,
            timestamp,
            username: `${
                process.env.NODE_ENV === 'dev'
                    ? 'Backend Dev Server'
                    : 'Backend Server'
            }`,
            avatar_url: process.env.LOGO_URL,
        };

        await axios
            .post(process.env.DISCORD_WEBHOOK, getJson(data))
            .catch(err => {
                if (err.response.status === 429)
                    asyncPublishMessageWebhook(data);
                else throw err;
            });
    })();
};

module.exports = asyncSendWebhook;
