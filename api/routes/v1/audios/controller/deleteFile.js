const asyncErrorWrapper = require('../../../asyncErrorWrapper.js');

const deleteFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    await gcStorage.bucket(process.env.BUCKET_NAME).file(req.params.filename).delete();        
    res.status(200).json({
        message: `Delete success[${req.params.filename} from google bucket]`,
        data: { }
    });
});

module.exports = deleteFile;