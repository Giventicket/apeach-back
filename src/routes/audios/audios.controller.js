const {Storage} = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.KEY_FILENAME });

const uploadFile = async (req, res, next) => {
    try {
        if(req.file === undefined)
            res.status(400).json({
                message: "upload failed [no audio file]",
                data: { }
            });
        res.status(200).json({
            message: "upload success [upload audio on google bucket]",
            data: req.file
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
} 

const deleteFile = async (req, res, next) => {
    try {
        const result = await storage.bucket('apeach-bucket').file(req.params.filename).delete();
        console.log(result);
        res.status(200).json({
            message: `remove file ${req.params.filename} from google bucket`,
            data: { }
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {uploadFile, deleteFile};