const ffmpeg = require('fluent-ffmpeg');
const asyncFileDelete = require('./asyncFileDelete');

const asyncPreprocess = filepath => {
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
                asyncFileDelete(filepath);
                return reject(err);
            })
            .run();
    });
};

module.exports = asyncPreprocess;
