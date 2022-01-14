const url = require('url');

const syncAudioDelete = async (gcStorage, audio, logger) => {
    try {
        const parsedAudio = url.parse(audio).pathname.split("/");
        await gcStorage.bucket(process.env.BUCKET_NAME).file(parsedAudio[7]).delete();                     
        logger.info(`[From Google Bucket] ${ audio } is deleted!, `);
    } catch(err) {
        logger.info(`[From Google Bucket] ${ audio } is not deleted!, `);
        logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}`);
    };
}

module.exports = syncAudioDelete;