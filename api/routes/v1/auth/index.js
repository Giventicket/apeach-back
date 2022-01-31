const express = require('express');
const controller = require('./controllers/index');
const audioController = require('../audios/controllers/index');
const decodeAccessToken = require('../middlewares/decodeAccessToken');

const router = express.Router();

router.post('/signin', controller.signin);
router.delete('/signout', decodeAccessToken, controller.signout);
router.get('/login', controller.login);

router.post(
    '/upload/preprocess',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    audioController.preprocess,
    controller.uploadFile,
);
// ${user.name}/chunk의 폴더에 음성파일 업로드

router.post(
    '/upload',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    controller.uploadFile,
);

router.post('/chunk/:id', decodeAccessToken, controller.addChunk);
//user의 chunks에 하나 추가하기

router.delete('/chunk/:id', decodeAccessToken, controller.removeChunk);
//user의 chunks에서 하나 제거하기

router.post('/make/samples', decodeAccessToken, controller.makeSamples);
//qualified=true인 user에게 samples 생성하기

router.patch('/sample/:id', decodeAccessToken, controller.updateSample);
//user의 samples 수정하기

module.exports = router;
