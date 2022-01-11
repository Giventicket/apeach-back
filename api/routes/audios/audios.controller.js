const formidable = require('formidable');
const form = formidable({ multiples: true });

const parseForm = (req, res, next) => {
    form.parse(req, (err, fields, files) => {
        try {
            req.files = files;
            console.log(files);
            next();
        } catch (err) {
            next(err);
        }
    });
};

const uploadFile = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        const result = await gcStorage.bucket('apeach-bucket').upload(req.files.audio.filepath, {
            destination: req.files.audio.newFilename,
            metadata: {
              contentType: req.files.audio.mimetype,
            },
        });
        res.status(200).json({
            message: "upload success [upload audio on google bucket]",
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

module.exports = {uploadFile, deleteFile, parseForm};