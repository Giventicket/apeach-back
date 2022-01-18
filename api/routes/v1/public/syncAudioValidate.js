const ffmpeg = require('fluent-ffmpeg');

const syncAudioValidate = (filepath) => {
    return new Promise((resolve,reject)=>{
      ffmpeg.ffprobe(filepath, (err, metadata) => {
        if (err) 
          reject(err);
        resolve(metadata);
      });        
   });
};

module.exports = syncAudioValidate;