const uploadFile = async (req, res, next) => {
    try {
        if(req.file === undefined){
            const err = new Error("upload failed [no audio file]");
            err.status = 400;
            throw err;
        }
        res.status(200).json({
            message: "upload success [upload audio on google bucket]",
            data: req.file
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

module.exports = {uploadFile, deleteFile};