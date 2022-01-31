const express = require('express');
const controller = require('./controllers/index');
const audioController = require('../audios/controllers/index');
const decodeAccessToken = require('../middlewares/decodeAccessToken');

const router = express.Router();

router.post('/chunk/:id', decodeAccessToken, controller.addChunk);

router.post('/make/samples', decodeAccessToken, controller.makeSamples);

router.post(
    '/upload/preprocess',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    audioController.preprocess,
    controller.uploadFile,
);

router.post(
    '/upload',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    controller.uploadFile,
);

router.post('/', controller.createUser);
// [post] user 생성하기

router.get('/:id', controller.getUser);
// [get] 매칭 되는 user 가져오기

router.get('/', controller.getUsers);
// [get] 전체 user 가져오기

router.patch('/sample/:id', decodeAccessToken, controller.updateSample);

router.patch('/:id', controller.updateUser);
// [update] user update 하기

router.delete('/chunk/:id', decodeAccessToken, controller.removeChunk);

router.delete('/:id', controller.deleteUser);
// [delete] id에 매칭되는 user 삭제하기

router.delete('/', controller.deleteUsers);
// [delete] 모두 삭제

module.exports = router;
