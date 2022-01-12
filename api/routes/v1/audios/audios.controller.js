const fs = require('fs');
const syncParseForm = require('./syncParseForm.js');
const syncPreprocess = require('./syncPreprocess.js');
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
    next();
});

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const result = await gcStorage.bucket(process.env.BUCKET_NAME).upload(req.files.audio.filepath, {
        destination: req.files.audio.newFilename,
        metadata: {
          contentType: req.files.audio.mimetype,
        },
    });
    fs.unlink(req.files.audio.filepath,(err)=>{ 
        if (err)
            req.logger.error(`status: ${(err.status || err.code || 500)}, message: ${err}`);
    });
    res.status(200).json({
        message: "upload success [upload audio on google bucket]",
        data: result[0].metadata
        });
});

const uploadFileAfterPreprocesssing = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const result = await gcStorage.bucket(process.env.BUCKET_NAME).upload(`${req.files.audio.filepath}R`, {
        destination: `${req.files.audio.newFilename}R`,
        metadata: {
          contentType: 'audio/wave',
        },
    });
    const tmpFiles = [req.files.audio.filepath, `${req.files.audio.filepath}R`];
    tmpFiles.forEach((filepath) => {
        fs.unlink(filepath,(err)=>{ 
            if (err)
                req.logger.error(`status: ${(err.status || err.code || 500)}, message: ${err}`);
        });
    });    
    res.status(200).json({
        message: "upload success [upload preprocessed audio on google bucket]",
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

module.exports = { uploadFile, deleteFile, parseForm, preprocess, uploadFileAfterPreprocesssing };