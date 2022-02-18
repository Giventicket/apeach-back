const formidable = require('formidable');

const form = new formidable.IncomingForm({
    multiples: false,
    maxFileSize: 500 * 1024 * 1024,
    hash: 'sha1',
});

const asyncParseForm = req => {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                asyncFileDelete(files.file.filepath);
                return reject(err);
            }
            resolve(files);
        });
    });
};

module.exports = asyncParseForm;
