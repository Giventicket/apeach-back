const express = require('express');
const controller = require('./controllers/index');
const audioController = require('../audios/controllers/index');
const decodeAccessToken = require('../middlewares/decodeAccessToken');

const router = express.Router();

router.post('/signin', controller.signin);
router.delete('/signout', decodeAccessToken, controller.signout);
router.get('/login', controller.login);

router.post(
    '/upload/preprocess/:option',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    audioController.preprocess,
    controller.uploadFile,
);
// ${user.name}/chunk의 폴더에 음성파일 업로드

router.post(
    '/upload/:option',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    controller.uploadFile,
);

router.post('/chunk/:id', decodeAccessToken, controller.addChunk);
//user의 chunks에 하나 추가하기

router.delete('/chunk/:id', decodeAccessToken, controller.removeChunk);
//user의 chunks에서 하나 제거하기

router.post('/chunk/:id', decodeAccessToken, controller.addSample);
//user의 samples에 하나 추가하기

router.delete('/chunk/:id', decodeAccessToken, controller.removeSample);
//user의 samples에서 하나 제거하기

module.exports = router;
