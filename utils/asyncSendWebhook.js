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

const asyncSendWebhook = chunk => {
    asyncErrorLoggerWrapper(async () => {
        const sourceD = `소스 음성: [source_wave_url](${chunk['source_wave_url']})\n`;
        const targetD = `타겟 음성: [target_wave_url](${chunk['target_wave_url']})\n\n`;
        let segsD = '';
        for (let idx in chunk['segments']) {
            const seg = chunk['segments'][idx];
            const segD = `  세그먼트 [${idx}]:\n    시작: ${seg['start_time']}\n    끝: ${seg['end_time']}\n    소스 텍스트: ${seg['source_text']}\n    타겟 텍스트: ${seg['target_text']}\n\n`;
            segsD += segD;
        }

        const data = {
            name: `${
                process.env.NODE_ENV === 'test'
                    ? 'Backend Scenario Test'
                    : 'anonymous user'
            }`,
            description: sourceD + targetD + segsD,
            timestamp: chunk['createdAt'],
            username: 'Apeach-backend',
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
