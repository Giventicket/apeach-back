const express = require('express');
const controllerCRUD = require('./engines.controller');
const middlewares = require('../../../middlewares/index');
                       
const router = express.Router();

// [post] audio 전처리해서 google bucket에 upload한 뒤에 chunk 반환하기
router.post('/create', controllerCRUD.parseForm, controllerCRUD.preprocess, controllerCRUD.upload, controllerCRUD.createChunk);

// [get] 매칭 되는 chunk 가져오기
router.get('/find/:id', middlewares.isValidID, controllerCRUD.getChunk);

// [get] 전체 chunk 가져오기
router.get('/find', controllerCRUD.getChunks);

// [delete] id에 매칭되는 chunk 하나 삭제하고 google bucket에 해당하는 audio 삭제
router.delete("/delete/:id", middlewares.isValidID, controllerCRUD.deleteChunk);

// [delete] 모든 chunks 삭제하고 google bucket에 해당하는 audio 삭제
router.delete("/delete", controllerCRUD.deleteChunks);

// [update] chunk update 하기
router.patch('/update/:id', middlewares.isValidID, controllerCRUD.updateChunk);


module.exports = router;