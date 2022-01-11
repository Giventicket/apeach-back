const fs = require('fs');
const syncParseForm = require('./syncParseForm.js');
const syncPreprocess = require('./syncPreprocess.js');
const { asyncErrorWrapper } = require('../asyncErrorWrapper.js');



const parseForm = asyncErrorWrapper(async (req, res, next) => {
    await syncParseForm(req).then().catch((err) => { throw err; });
    next();
});


const preprocess = asyncErrorWrapper(async (req, res, next) => {
    await syncPreprocess(req.files.audio.filepath).then().catch((err) => { throw err; });
    next();
});

const uploadFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const result = await gcStorage.bucket('apeach-bucket').upload(req.files.audio.filepath, {
        destination: req.files.audio.newFilename,
        metadata: {
          contentType: req.files.audio.mimetype,
        },
    });
    fs.unlink(req.files.audio.filepath,(err)=>{ 
        if (err)
            req.logger.error(`status: ${(err.status || 500)}, message: ${err.message}`);
    });
    res.status(200).json({
        message: "upload success [upload audio on google bucket]",
        data: result[0].metadata
        });
});

const uploadFileAfterPreprocesssing = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const result = await gcStorage.bucket('apeach-bucket').upload(`${req.files.audio.filepath}R`, {
        destination: `${req.files.audio.newFilename}R`,
        metadata: {
          contentType: 'audio/wave',
        },
    });
    fs.unlink(req.files.audio.filepath,(err)=>{ 
        if (err)
            req.logger.error(`status: ${(err.status || 500)}, message: ${err.message}`);
    });
    fs.unlink(`${req.files.audio.filepath}R`,(err)=>{ 
        if (err)
            req.logger.error(`status: ${(err.status || 500)}, message: ${err.message}`);
    });
    res.status(200).json({
        message: "upload success [upload preprocessed audio on google bucket]",
        data: result[0].metadata
    });
});

const deleteFile = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    await gcStorage.bucket('apeach-bucket').file(req.params.filename).delete();        
    res.status(200).json({
        message: `Delete success[${req.params.filename} from google bucket]`,
        data: { }
    });
});

module.exports = { uploadFile, deleteFile, parseForm, preprocess, uploadFileAfterPreprocesssing };