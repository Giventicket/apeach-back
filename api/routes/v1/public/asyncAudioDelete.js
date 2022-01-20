const url = require('url');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');

const asyncAudioDelete = (gcStorage, audio, logger) => {
    asyncErrorLoggerWrapper(async () => {
        const parsedAudio = url.parse(audio).pathname.split('/');
        return gcStorage
            .bucket(process.env.BUCKET_NAME)
            .file(decodeURIComponent(parsedAudio[7]))
            .delete();
    }, logger)();
};

module.exports = asyncAudioDelete;
