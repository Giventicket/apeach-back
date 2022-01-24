const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');

const deleteFile = asyncErrorWrapper(async (req, res, next) => {
    await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .file(decodeURIComponent(req.params.filename))
        .delete();
    res.status(200).json({
        message: `Delete success[${req.params.filename} from google bucket]`,
        data: {},
    });
});

module.exports = deleteFile;
