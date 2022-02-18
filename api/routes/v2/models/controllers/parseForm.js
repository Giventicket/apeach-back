const asyncParseForm = require('../../../../../utils/asyncParseForm.js');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');

const parseForm = asyncErrorWrapper(async (req, res, next) => {
    let files = await asyncParseForm(req);
    if (Object.keys(files).length === 0) {
        const err = new Error('upload failed [no model file]');
        err.status = 400;
        throw err;
    }
    console.log('header ', Number(req.headers['content-length']));
    console.log('dump ', Number(files.file.size));

    req.files = files;

    if (Number(req.params.size) !== Number(files.file.size)) {
        asyncFileDelete(files.file.filepath);
        const err = new Error(
            `dump failed [different file size ${Number(files.file.size)}]`,
        );
        err.status = 501;
        throw err;
    }

    next();
});

module.exports = parseForm;
