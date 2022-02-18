const path = require('path');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const uploadModel = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;
    const file = req.files.file;
    const filepath = file.filepath;
    const mimetype = file.mimetype;
    const result = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(filepath, {
            destination: `model/${user.name}/${req.params.speakerName}${
                user.models.length
            }${path.extname(file.originalFilename)}`,
            metadata: {
                contentType: mimetype,
            },
        })
        .catch(err => {
            asyncFileDelete(file.filepath);
            throw err;
        });
    asyncFileDelete(file.filepath);

    req.modelUrl = result[0].metadata.mediaLink;
    // console.log('gcs ', Number(result[0].metadata.size));

    next();
});

module.exports = uploadModel;
