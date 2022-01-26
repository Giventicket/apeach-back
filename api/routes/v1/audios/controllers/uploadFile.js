const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const deleteTmp = () => {
        let tmpFiles = [req.files.audio.filepath];
        if (req.resampled) tmpFiles.push(filepath);

        tmpFiles.forEach(fp => {
            asyncFileDelete(fp);
        });
    };
    const filepath = req.resampled
        ? `${req.files.audio.filepath}R`
        : req.files.audio.filepath;
    const destination = req.resampled
        ? `${req.files.audio.newFilename}R.wav`
        : `${req.files.audio.newFilename}.wav`;
    const mimetype = req.resampled ? 'audio/wave' : req.files.audio.mimetype;
    const result = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(filepath, {
            destination: `audio/${destination}`,
            metadata: {
                contentType: mimetype,
            },
        })
        .catch(err => {
            deleteTmp();
            throw err;
        });

    deleteTmp();

    result[0].metadata.duration = req.duration;
    res.status(200).json({
        message: `upload success [upload ${
            req.resampled ? 'preprocessed ' : ''
        }audio on google bucket]`,
        data: result[0].metadata,
    });
});

module.exports = uploadFile;
