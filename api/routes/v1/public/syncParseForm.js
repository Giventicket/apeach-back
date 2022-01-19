const formidable = require('formidable');
const form = formidable({ multiples: true });

const syncParseForm = req => {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            //console.log(files);
            resolve(files);
        });
    });
};

module.exports = syncParseForm;
