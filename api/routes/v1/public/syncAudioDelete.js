const url = require('url');

const syncAudioDelete = (gcStorage, audio="", logger) => {
    if(audio == null)
      return;  
    const parsedAudio = url.parse(audio).pathname.split("/");
    return gcStorage.bucket(process.env.BUCKET_NAME).file(parsedAudio[7]).delete().then(() => {
      logger.info(`[From Google Bucket] ${ audio } is deleted!, `);
    }).catch(err => {
      logger.error(`[From Google Bucket] ${ audio } is not deleted!, `);
      logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}\n`);
    });
}

module.exports = syncAudioDelete;