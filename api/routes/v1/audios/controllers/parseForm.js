const asyncParseForm = require('../../public/asyncParseForm.js');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const parseForm = asyncErrorWrapper(async (req, res, next) => {
    const files = await asyncParseForm(req);
    if (Object.keys(files).length === 0) {
        const err = new Error('upload failed [no audio file]');
        err.status = 400;
        throw err;
    }
    req.files = files;
    next();
});

module.exports = parseForm;
