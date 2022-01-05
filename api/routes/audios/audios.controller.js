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
        const gcStorage = req.gcStorage;
        await gcStorage.bucket('apeach-bucket').file(req.params.filename).delete();        
        res.status(200).json({
            message: `Delete success[${req.params.filename} from google bucket]`,
            data: { }
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {uploadFile, deleteFile};