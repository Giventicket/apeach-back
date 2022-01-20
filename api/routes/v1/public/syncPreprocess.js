const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;

const syncPreprocess = filepath => {
    //ffmpeg -i {input} -ar 16000 -ac 1 -sample_fmt s16 {output}
    return new Promise((resolve, reject) => {
        ffmpeg(filepath)
            .format('wav')
            .outputOptions([`-ar 16000`, `-ac 1`, `-sample_fmt s16`])
            .output(`${filepath}R`)
            .on('end', () => {
                resolve();
            })
            .on('error', err => {
                fs.unlink(filepath).catch(err => {
                    req.logger.error(
                        `status: ${
                            err.status || err.code || 500
                        }, message: ${err}\n`,
                    );
                });
                return reject(new Error(err));
            })
            .run();
    });
};

module.exports = syncPreprocess;
