const express = require('express');
const path = require('path');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now().toString(16) + '-' + file.fieldname + '.mp3')
  }
});

const upload = multer({
  storage: multerGoogleStorage.storageEngine({
      bucket: "apeach-bucket",
      projectId: "pathfinder-101",
      keyFilename: "pathfinder-101-9d1284a4db26.json"
  })
});

// audio 저장하기
router.post('/upload', upload.single('audio'), async (req, res, next) => {
    try {
        console.log(req.file);
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

module.exports = router;