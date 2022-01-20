const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');
const asyncFileDelete = require('../../public/asyncFileDelete.js');

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const deleteTmp = () => {
        let tmpFiles = [req.files.audio.filepath];
        if (req.resampled) tmpFiles.push(filepath);

        tmpFiles.forEach(fp => {
            asyncFileDelete(fp, req.logger);
        });
    };
    const gcStorage = req.gcStorage;
    const filepath = req.resampled
        ? `${req.files.audio.filepath}R`
        : req.files.audio.filepath;
    const destination = req.resampled
        ? `${req.files.audio.newFilename}R`
        : req.files.audio.newFilename;
    const mimetype = req.resampled ? 'audio/wave' : req.files.audio.mimetype;
    const result = await gcStorage
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

    res.status(200).json({
        message: `upload success [upload ${
            req.resampled ? 'preprocessed ' : ''
        }audio on google bucket]`,
        data: result[0].metadata,
    });
});

module.exports = uploadFile;
