const fs = require('fs');
const { v4 } = require('uuid');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const parseFile = asyncErrorWrapper(async (req, res, next) => {
    const { file } = req;
    console.log(file);
    const tmpPath = `./${v4()}`;
    await fs.writeFileSync(tmpPath, file.buffer);
    req.files = {};
    req.files.file = {};
    req.files.file.filepath = tmpPath;
    req.files.file.mimetype = file.mimetype;
    req.files.file.originalFilename = file.originalname;
    next();
});

module.exports = parseFile;
