const asyncPreprocess = require('../../../../../utils/asyncPreprocess.js');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const preprocess = asyncErrorWrapper(async (req, res, next) => {
    const file = req.files.file;
    await asyncPreprocess(file.filepath);
    next();
});

module.exports = preprocess;
