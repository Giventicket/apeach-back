const path = require('path');

const Model = require('../../../../../models/v1/model/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const uploadModel = asyncErrorWrapper(async (req, res, next) => {
    const filepath = req.files.model.filepath;
    const mimetype = req.files.model.mimetype;

    const result = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(filepath, {
            destination: `model/${req.params.speakerId}${path.extname(
                req.files.model.originalFilename,
            )}`,
            metadata: {
                contentType: mimetype,
            },
        })
        .catch(err => {
            asyncFileDelete(req.files.model.filepath);
            throw err;
        });

    asyncFileDelete(req.files.model.filepath);

    await Model.create({
        speakerId: req.params.speakerId,
        model_url: result[0].metadata.mediaLink,
    });

    res.status(200).json({
        message: `upload success [upload a model on google bucket]`,
        data: result[0].metadata,
    });
});

module.exports = uploadModel;
