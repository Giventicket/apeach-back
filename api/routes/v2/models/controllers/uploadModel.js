const path = require('path');

const Model = require('../../../../../models/v2/model/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const uploadModel = asyncErrorWrapper(async (req, res, next) => {
    const file = req.files.file;
    const filepath = file.filepath;
    const mimetype = file.mimetype;

    const result = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(filepath, {
            destination: `model/${req.params.speakerName}${path.extname(
                file.originalFilename,
            )}`,
            metadata: {
                contentType: mimetype,
            },
        })
        .catch(err => {
            asyncFileDelete(file.filepath);
            throw err;
        });

    asyncFileDelete(file.filepath);

    const model = await Model.create({
        speakerName: req.params.speakerName,
        modelUrl: result[0].metadata.mediaLink,
    });

    res.status(200).json({
        message: `upload success [upload a model on google bucket]`,
        data: model,
    });
});

module.exports = uploadModel;
