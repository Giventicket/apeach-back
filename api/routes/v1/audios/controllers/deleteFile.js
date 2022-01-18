const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const deleteFile = asyncErrorWrapper((req, res, next) => {
    const gcStorage = req.gcStorage;
    return gcStorage.bucket(process.env.BUCKET_NAME).file(decodeURIComponent(req.params.filename)).delete().then(() => {
      res.status(200).json({
        message: `Delete success[${req.params.filename} from google bucket]`,
        data: { }
      });
    });        
});

module.exports = deleteFile;