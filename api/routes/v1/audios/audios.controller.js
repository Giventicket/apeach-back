const fs = require('fs');
const syncParseForm = require('../public/syncParseForm.js');
const syncPreprocess = require('../public/syncPreprocess.js');
const { asyncErrorWrapper } = require('../../asyncErrorWrapper.js');


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


const preprocess = asyncErrorWrapper(async (req, res, next) => {
    await syncPreprocess(req.files.audio.filepath).then().catch((err) => { throw err; });
    req.resampled = true;
    next();
});

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const filepath = req.resampled ? `${req.files.audio.filepath}R` : req.files.audio.filepath;
    const mimetype = req.resampled ? 'audio/wave' : req.files.audio.mimetype;
    const result = await gcStorage.bucket(process.env.BUCKET_NAME).upload(filepath, {
        destination: req.files.audio.newFilename,
        metadata: {
          contentType: mimetype,
        },
    });
    let tmpFiles = [req.files.audio.filepath];
    if (req.resampled)
        tmpFiles.push(`${req.files.audio.filepath}R`);
    tmpFiles.forEach((filepath) => {
        fs.unlink(filepath,(err)=>{ 
            if (err)
                req.logger.error(`status: ${(err.status || err.code || 500)}, message: ${err}`);
        });
    });   
    res.status(200).json({
        message: `upload success [upload ${ req.resampled ? "preprocessed " : "" }audio on google bucket]`,
        data: result[0].metadata
    });
});

const deleteFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    await gcStorage.bucket(process.env.BUCKET_NAME).file(req.params.filename).delete();        
    res.status(200).json({
        message: `Delete success[${req.params.filename} from google bucket]`,
        data: { }
    });
});

module.exports = { uploadFile, deleteFile, parseForm, preprocess };