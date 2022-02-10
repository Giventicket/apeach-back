const formidable = require('formidable');
const form = formidable({ multiples: true });

const asyncParseForm = (req, key) => {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                asyncFileDelete(files.audio.filepath || files.model.filepath);
                return reject(err);
            }
            resolve(files);
        });
    });
};

module.exports = asyncParseForm;
