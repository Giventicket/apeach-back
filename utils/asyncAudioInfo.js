const ffmpeg = require('fluent-ffmpeg');
const asyncFileDelete = require('./asyncFileDelete');

const asyncAudioInfo = filepath => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filepath, (err, metadata) => {
            if (err) {
                asyncFileDelete(filepath);
                return reject(err);
            }
            resolve(metadata);
        });
    });
};

module.exports = asyncAudioInfo;
