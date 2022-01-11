const formidable = require('formidable');
const form = formidable({ multiples: true });

const syncParseForm = (req) => {
    return new Promise((resolve,reject)=>{
        form.parse(req, (err, fields, files) => {
            if (err)
                reject(err);
            req.files = files;
            //console.log(files);
            resolve();
        });
   });
};

module.exports = syncParseForm;