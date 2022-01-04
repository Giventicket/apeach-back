const express = require('express');
const path = require('path');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const {Storage} = require('@google-cloud/storage');

const router = express.Router();
const storage = new Storage({ keyFilename: process.env.KEY_FILENAME });

const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: process.env.BUCKET_NAME,
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEY_FILENAME
    })
});

// audio 저장하기
router.post('/upload', upload.single('audio'), async (req, res, next) => {
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
});
 
// audio 삭제하기
router.delete('/:filename', async (req, res, next) => {
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
});

module.exports = router;