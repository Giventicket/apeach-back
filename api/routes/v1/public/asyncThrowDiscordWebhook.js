const fs = require('fs').promises;
const { v4 } = require('uuid');
const asyncFileDelete = require('./asyncFileDelete');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');

const asyncThrowDiscordWebhook = (gcStorage, chunk, logger) => {
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
            embeds: [
                {
                    author: {
                        name: `${
                            process.env.NODE_ENV === 'test'
                                ? 'Backend Scenario Test'
                                : 'anonymous user'
                        }`,
                    },
                    description: sourceD + targetD + segsD,
                    timestamp: chunk['createdAt'],
                },
            ],
            username: 'Apeach-backend',
            avatar_url: process.env.LOGO_URL,
        };

        const dataJSON = JSON.stringify(data);
        const filepath = v4();
        return fs.writeFile(filepath, dataJSON).then(() => {
            gcStorage
                .bucket(process.env.BUCKET_NAME)
                .upload(`./${filepath}`, {
                    destination: `discord_webhook/${filepath}`,
                    metadata: {
                        contentType: 'text/plain; charset=utf-8',
                    },
                })
                .catch(err => {
                    asyncFileDelete(filepath, logger);
                    throw err;
                })
                .then(() => {
                    asyncFileDelete(filepath, logger);
                })
                .catch(err => {
                    throw err;
                });
        });
    }, logger)();
};

module.exports = asyncThrowDiscordWebhook;
