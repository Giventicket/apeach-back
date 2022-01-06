const express = require('express');
const controller = require('./chunks.controller');
const {isRequired} = require('../../middlewares/index');

const router = express.Router();

// [post] chunk 생성하기
router.post('/', isRequired("body", 'source_wave_url'), controller.createChunk);

// [get] 매칭 되는 chunk 가져오기
router.get('/:id', controller.getChunk);

// [get] 전체 chunk 가져오기
router.get('/', controller.getChunks);

// [update] chunk update 하기
router.patch('/:id', isRequired("params", 'id'), controller.updateChunk);

// [delete] id에 매칭되는 chunk 하나 삭제하기
router.delete("/:id", controller.deleteChunk);

// [delete] 모두 삭제
router.delete("/", controller.deleteChunks);


module.exports = router;