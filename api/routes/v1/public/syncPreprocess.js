const ffmpeg = require('fluent-ffmpeg');

const preprocessSync = (filepath) => {
    //ffmpeg -i {input} -ar 16000 -ac 1 -sample_fmt s16 {output}        
    return new Promise((resolve,reject)=>{
        ffmpeg(filepath)
            .format('wav')
            .outputOptions([
                `-ar 16000`,
                `-ac 1`,
                `-sample_fmt s16`])
            .output(`${filepath}R`)
            .on('end', () => {
                resolve();
            })
            .on('error', (err) => { return reject(new Error(err)); })
            .run();        
   });
};

module.exports = preprocessSync;