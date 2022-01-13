const fs = require('fs');
const asyncErrorWrapper = require('../../../asyncErrorWrapper.js');

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const filepath = req.resampled ? `${req.files.audio.filepath}R` : req.files.audio.filepath;
    const mimetype = req.resampled ? 'audio/wave' : req.files.audio.mimetype;
    const result = await gcStorage.bucket(process.env.BUCKET_NAME).upload(filepath, {
        destination: req.files.audio.newFilename,
        metadata: {
          contentType: mimetype,
        },
    });
    let tmpFiles = [req.files.audio.filepath];
    if (req.resampled)
        tmpFiles.push(`${req.files.audio.filepath}R`);
    tmpFiles.forEach((filepath) => {
        fs.unlink(filepath,(err)=>{ 
            if (err)
                req.logger.error(`status: ${(err.status || err.code || 500)}, message: ${err}`);
        });
    });   
    res.status(200).json({
        message: `upload success [upload ${ req.resampled ? "preprocessed " : "" }audio on google bucket]`,
        data: result[0].metadata
    });
});

module.exports = uploadFile;