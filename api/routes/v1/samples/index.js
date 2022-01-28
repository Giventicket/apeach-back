const express = require('express');
const controller = require('./controllers/index');

const router = express.Router();

router.post('/', controller.createSample);
// [post] sample 생성하기

router.get('/:id', controller.getSample);
// [get] 매칭 되는 sample 가져오기

router.get('/', controller.getSamples);
// [get] 전체 user 가져오기

router.patch('/:id', controller.updateSample);
// [update] user update 하기

router.delete('/:id', controller.deleteSample);
// [delete] id에 매칭되는 user 삭제하기

router.delete('/', controller.deleteSamples);
// [delete] 모두 삭제

module.exports = router;
