const path = require('path');
const { v4 } = require('uuid');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const uploadAudio = asyncErrorWrapper(async (req, res, next) => {
    const { user, isAuthUser, sample, samplesAudioCnt } = req;

    if (!isAuthUser) {
        const err = new Error(`Not allowed, please login!`);
        err.status = 404;
        throw err;
    }

    const file = req.files.file;
    const filepath = file.filepath + 'R';
    const mimetype = file.mimetype;

    const destination = `audio/${
        user.name
    }/sample/${samplesAudioCnt}${path.extname(file.originalFilename)}`;

    const result = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(filepath, {
            destination: destination,
            metadata: {
                contentType: mimetype,
            },
        })
        .catch(err => {
            asyncFileDelete(file.filepath);
            asyncFileDelete(file.filepath + 'R');
            throw err;
        });

    asyncFileDelete(file.filepath);
    asyncFileDelete(file.filepath + 'R');

    req.waveUrl = result[0].metadata.mediaLink;
    next();
});

module.exports = uploadAudio;
