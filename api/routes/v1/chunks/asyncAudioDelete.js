const url = require('url');

const asyncAudioDelete = async (gcStorage, audio, logger) => {
    try {
        const parsedAudio = url.parse(audio).path.split("/");
        await gcStorage.bucket('apeach-bucket').file(parsedAudio[1]).delete();                     
        logger.info(`[From Google Bucket] ${ parsedAudio[1] } is deleted on google bucket!, `)
    } catch(err) {err.code || 
        logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}`);
    };
}

module.exports = asyncAudioDelete;