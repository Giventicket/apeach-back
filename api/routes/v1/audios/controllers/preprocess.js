const asyncPreprocess = require('../../../../../utils/asyncPreprocess.js');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const preprocess = asyncErrorWrapper(async (req, res, next) => {
    await asyncPreprocess(req.files.audio.filepath);
    req.resampled = true;
    next();
});

module.exports = preprocess;
