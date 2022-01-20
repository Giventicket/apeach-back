const asyncPreprocess = require('../../public/asyncPreprocess.js');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const preprocess = asyncErrorWrapper(async (req, res, next) => {
    return asyncPreprocess(req.files.audio.filepath, req.logger).then(() => {
        req.resampled = true;
        next();
    });
});

module.exports = preprocess;
