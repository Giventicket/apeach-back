const syncPreprocess = require('../../public/syncPreprocess.js');
const asyncErrorWrapper = require('../../../asyncErrorWrapper.js');

const preprocess = asyncErrorWrapper(async (req, res, next) => {
    await syncPreprocess(req.files.audio.filepath).then().catch((err) => { throw err; });
    req.resampled = true;
    next();
});

module.exports = preprocess;