const asyncParseForm = require('../../../../../utils/asyncParseForm.js');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');

const parseForm = asyncErrorWrapper(async (req, res, next) => {
    const files = await asyncParseForm(req);
    if (Object.keys(files).length === 0) {
        const err = new Error('upload failed [no model file]');
        err.status = 400;
        throw err;
    }
    req.files = files;
    next();
});

module.exports = parseForm;