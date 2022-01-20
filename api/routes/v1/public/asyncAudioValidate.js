const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;
const asyncFileDelete = require('./asyncFileDelete');

const asyncAudioValidate = (filepath, logger) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filepath, (err, metadata) => {
            if (err) {
                asyncFileDelete(filepath, logger);
                return reject(err);
            }
            resolve(metadata);
        });
    });
};

module.exports = asyncAudioValidate;
