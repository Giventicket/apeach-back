const url = require('url');

const syncAudioDelete = (gcStorage, audio, logger) => {
  try {
    const parsedAudio = url.parse(audio).pathname.split("/");
    return gcStorage.bucket(process.env.BUCKET_NAME).file(decodeURIComponent(parsedAudio[7])).delete().then(() => {
    }).catch(err => {
      logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}\n`);
    });
  } catch (err) {
    logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}\n`);
  }
}

module.exports = syncAudioDelete;