const syncPreprocess = require('../../public/syncPreprocess.js');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const preprocess = asyncErrorWrapper(async (req, res, next) => {
    return syncPreprocess(req.files.audio.filepath).then(() => {
        req.resampled = true;
        next();
    });
});

module.exports = preprocess;
