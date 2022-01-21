const url = require('url');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const asyncPublishMessage_bucket = require('./asyncPublishMessage_bucket');

const asyncAudioDelete = (gcStorage, audio, logger) => {
    asyncErrorLoggerWrapper(async () => {
        const parsedAudio = url.parse(audio).pathname.split('/');
        filename = decodeURIComponent(parsedAudio[7]);
        await gcStorage
            .bucket(process.env.BUCKET_NAME)
            .file(filename)
            .delete()
            .catch(err => {
                if (err.code === 429)
                    asyncPublishMessage_bucket(filename, logger);
                throw err;
            });
    }, logger)();
};

module.exports = asyncAudioDelete;
