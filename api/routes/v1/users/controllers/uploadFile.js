const path = require('path');

const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

    let cnt = 0;
    if (req.body.option === 'chunk') {
        cnt = user.chunksAudioCnt + 1;
        const user = await User.findOneAndUpdate(
            { _id: req.userId },
            { chunksAudioCnt: cnt },
            { new: true },
        ).exec();
    } else if (req.body.option === 'sample') {
        cnt = user.samplesAudioCnt + 1;
        const user = await User.findOneAndUpdate(
            { _id: req.userId },
            { samplesAudioCnt: cnt },
            { new: true },
        ).exec();
    }
    const filepath = req.resampled
        ? `${req.files.audio.filepath}R`
        : req.files.audio.filepath;
    const destination = req.resampled
        ? `${cnt}.wav`
        : `${cnt}${path.extname(req.files.audio.originalFilename)}`;
    const mimetype = req.resampled ? 'audio/wave' : req.files.audio.mimetype;

    const deleteTmp = () => {
        let tmpFiles = [req.files.audio.filepath];
        if (req.resampled) tmpFiles.push(filepath);

        tmpFiles.forEach(fp => {
            asyncFileDelete(fp);
        });
    };

    const result = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(filepath, {
            destination: `audio/${user.name}/${destination}`,
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
        message: `upload a ${
            req.resampled ? 'preprocessed ' : ''
        }file on google bucket success`,
        data: result[0].metadata,
    });
});

module.exports = uploadFile;
