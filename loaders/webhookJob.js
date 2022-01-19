const schedule = require('node-schedule');
const axios = require('axios');

module.exports = app => {
    const gcStorage = app.get('gcStorage');
    const logger = app.get('logger');

    let turn = 0;

    const webhook_start = length => {
        return axios.post(process.env.DISCORD_WEBHOOK, {
            embeds: [
                {
                    author: {
                        name: 'Backend Job Scheduler',
                    },
                    description: `apeach backend 스케쥴러 작동 시작!\n총 ${length}개의 사용을 보고합니다!`,
                    color: 1127128,
                },
            ],
            username: 'Apeach-backend',
            avatar_url: process.env.LOGO_URL,
        });
    };

    const delete_file = filename => {
        gcStorage
            .bucket(process.env.BUCKET_NAME)
            .file(filename)
            .delete()
            .catch(err => {
                logger.error(
                    `status: ${
                        err.status || err.code || 500
                    }, message: ${err}\n`,
                );
            });
    };

    const webhook_file = (data, filename) => {
        axios
            .post(
                process.env.DISCORD_WEBHOOK,
                JSON.parse(data.toString('utf8')),
            )
            .catch(err => {
                setTimeout(() => {
                    webhook_file(data, filename);
                }, 250 * turn++);
                throw err;
            })
            .then(() => {
                delete_file(filename);
            })
            .catch(err => {
                logger.error(
                    `status: ${
                        err.status || err.code || 500
                    }, message: ${err}\n`,
                );
            });
    };

    const job_callback = async files => {
        webhook_start(files[0].length)
            .then(() => {
                for (let file of files[0]) {
                    file.createReadStream()
                        .on('data', data => {
                            setTimeout(() => {
                                webhook_file(data, file.metadata.name);
                            }, 250 * turn++);
                        })
                        .on('error', err => {
                            logger.error(
                                `status: ${
                                    err.status || err.code || 500
                                }, message: ${err}\n`,
                            );
                        });
                }
            })
            .catch(err => {
                logger.error(
                    `status: ${
                        err.status || err.code || 500
                    }, message: ${err}\n`,
                );
            });
    };

    const job = schedule.scheduleJob('0 0 * * * *', () => {
        gcStorage
            .bucket(process.env.BUCKET_NAME)
            .getFiles({
                prefix: `discord_webhook`,
                metadata: {
                    contentType: 'text/plain;charset=UTF-8',
                },
            })
            .then(job_callback)
            .catch(err => {
                logger.error(
                    `status: ${
                        err.status || err.code || 500
                    }, message: ${err}\n`,
                );
            });
    });
};
