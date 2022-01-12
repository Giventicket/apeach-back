const express = require('express');
const controller = require('./audios.controller');
                       
const router = express.Router();

// audio 저장하기
router.post('/upload/preprocess', controller.parseForm, controller.preprocess, controller.uploadFile);
router.post('/upload', controller.parseForm, controller.uploadFile);
 
// audio 삭제하기
router.delete('/:filename', controller.deleteFile);

module.exports = router;