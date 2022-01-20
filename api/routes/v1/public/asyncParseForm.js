const formidable = require('formidable');
const form = formidable({ multiples: true });
const fs = require('fs').promises;
const asyncFileDelete = require('./asyncFileDelete');

const asyncParseForm = req => {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                asyncFileDelete(files.audio.filepath, req.logger);
                return reject(err);
            }
            resolve(files);
        });
    });
};

module.exports = asyncParseForm;
