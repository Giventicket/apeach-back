const asyncPreprocess = require('../../public/asyncPreprocess.js');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const preprocess = asyncErrorWrapper(async (req, res, next) => {
    await asyncPreprocess(req.files.audio.filepath, req.logger);
    req.resampled = true;
    next();
});

module.exports = preprocess;
