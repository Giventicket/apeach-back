const url = require('url');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const asyncPublishMessageBucket = require('./asyncPublishMessageBucket');
const gcpStorage = require('./gcpStorage');

const asyncAudioDelete = audioUrl => {
    asyncErrorLoggerWrapper(async () => {
        const parsedAudioUrl = url.parse(audioUrl).pathname.split('/');
        filename = decodeURIComponent(
            parsedAudioUrl[parsedAudioUrl.length - 1],
        );
        await gcpStorage
            .bucket(process.env.BUCKET_NAME)
            .file(filename)
            .delete()
            .catch(err => {
                if (err.code === 429) asyncPublishMessageBucket(filename);
                else throw err;
            });
    })();
};

module.exports = asyncAudioDelete;
