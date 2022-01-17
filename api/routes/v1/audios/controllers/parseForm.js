const syncParseForm = require('../../public/syncParseForm.js');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const parseForm = asyncErrorWrapper(async (req, res, next) => {
    await syncParseForm(req).then((files) => {
        if (Object.keys(files).length === 0) {
            const err = new Error("upload failed [no audio file]");
            err.status = 400;
            throw err;
        }
        req.files = files;
    }).catch((err) => { throw err; });
    next();
});

module.exports = parseForm;