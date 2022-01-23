const url = require('url');
const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const asyncPublishMessageBucket = require('./asyncPublishMessageBucket');
const gcStorage = require('./gcStorage');

const asyncAudioDelete = audio => {
    asyncErrorLoggerWrapper(async () => {
        const parsedAudio = url.parse(audio).pathname.split('/');
        filename = decodeURIComponent(parsedAudio[7]);
        await gcStorage
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
