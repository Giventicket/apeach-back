const express = require('express');
const controller = require('./chunks.controller');
const middlewares = require('../../../middlewares/index');

const router = express.Router();

// [post] chunk 생성하기
router.post('/', middlewares.isRequired("body", 'source_wave_url', true), controller.createChunk);

// [get] 매칭 되는 chunk 가져오기
router.get('/:id', middlewares.isValidID, controller.getChunk);

// [get] 전체 chunk 가져오기
router.get('/', controller.getChunks);

// [update] chunk update 하기
router.patch('/:id', middlewares.isValidID, controller.updateChunk);

// [delete] id에 매칭되는 chunk 하나 삭제하기
router.delete("/:id", middlewares.isValidID, controller.deleteChunk);

// [delete] 모두 삭제
router.delete("/", controller.deleteChunks);


module.exports = router;