const asyncParseForm = require('../../public/asyncParseForm.js');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const parseForm = asyncErrorWrapper(async (req, res, next) => {
    return asyncParseForm(req).then(files => {
        if (Object.keys(files).length === 0) {
            const err = new Error('upload failed [no audio file]');
            err.status = 400;
            throw err;
        }
        req.files = files;
        next();
    });
});

module.exports = parseForm;
