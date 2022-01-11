const formidable = require('formidable');
const form = formidable({ multiples: true });
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const parseForm = (req, res, next) => {
    form.parse(req, (err, fields, files) => {
        try {
            req.files = files;
            //console.log(files);
            next();
        } catch (err) {
            next(err);
        }
    });
};

const preprocessSync = (filepath) => {
    return new Promise((resolve,reject)=>{
        ffmpeg(filepath)
            .format('wav')
            .outputOptions([
                `-ar 16000`,
                `-ac 1`,
                `-sample_fmt s16`])
            .output(`${filepath}R`)
            .on('end', () => {
                resolve();
            })
            .on('error', (err) => {return reject(new Error(err));})
            .run();        
   });
};


const preprocess = async (req, res, next) => {
    try {
        //ffmpeg -i {input} -ar 16000 -ac 1 -sample_fmt s16 {output}        
        await preprocessSync(req.files.audio.filepath).then().catch((err) => {throw err;});
        next();
    } catch (err) {
        next(err);
    }
}

const uploadFile = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        const result = await gcStorage.bucket('apeach-bucket').upload(req.files.audio.filepath, {
            destination: req.files.audio.newFilename,
            metadata: {
              contentType: req.files.audio.mimetype,
            },
        });
        fs.unlink(req.files.audio.filepath,(err)=>{ 
            if(err)
                req.logger.error(`status: ${(err.status || 500)}, message: ${err.message}`);
        });
        res.status(200).json({
            message: "upload success [upload audio on google bucket]",
            data: result[0].metadata
        });
    } catch (err) {
        next(err);
    }
} 

const uploadFileAfterPreprocesssing = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        const result = await gcStorage.bucket('apeach-bucket').upload(`${req.files.audio.filepath}R`, {
            destination: `${req.files.audio.newFilename}R`,
            metadata: {
              contentType: 'audio/wave',
            },
        });
        fs.unlink(req.files.audio.filepath,(err)=>{ 
            if(err)
                req.logger.error(`status: ${(err.status || 500)}, message: ${err.message}`);
        });
        fs.unlink(`${req.files.audio.filepath}R`,(err)=>{ 
            if(err)
                req.logger.error(`status: ${(err.status || 500)}, message: ${err.message}`);
        });
        res.status(200).json({
            message: "upload success [upload preprocessed audio on google bucket]",
            data: result[0].metadata
        });
    } catch (err) {
        next(err);
    }
}


const deleteFile = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        await gcStorage.bucket('apeach-bucket').file(req.params.filename).delete();        
        res.status(200).json({
            message: `Delete success[${req.params.filename} from google bucket]`,
            data: { }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {uploadFile, deleteFile, parseForm, preprocess, uploadFileAfterPreprocesssing};