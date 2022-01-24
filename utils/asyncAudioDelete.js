const url = require('url');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const asyncPublishMessageBucket = require('./asyncPublishMessageBucket');
const gcpStorage = require('./gcpStorage');

const asyncAudioDelete = audio => {
    asyncErrorLoggerWrapper(async () => {
        const parsedAudio = url.parse(audio).pathname.split('/');
        filename = decodeURIComponent(parsedAudio[7]);
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
