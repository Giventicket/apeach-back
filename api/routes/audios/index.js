const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const controller = require('./audios.controller');

const router = express.Router();

const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: process.env.BUCKET_NAME,
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEY_FILENAME
    })
});

// audio 저장하기
router.post('/upload', upload.single('audio'), controller.uploadFile);
 
// audio 삭제하기
router.delete('/:filename', controller.deleteFile);

module.exports = router;