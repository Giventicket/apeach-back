const express = require('express');

const Multer = require('multer');
const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 500 * 1024 * 1024,
});

const controller = require('./controllers/index');
const decodeToken = require('../middlewares/decodeToken');
const router = express.Router();

/**
 *  @swagger
 *  /api/v2/models/upload/{speakerName}:
 *    post:
 *      tags:
 *      - Model
 *      summary: 'model 파일의 업로드'
 *      description: model을 google storage의 model/{speakerName}.zip에 업로드한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: speakerName
 *          type: string
 *          required: true
 *        - in: formData
 *          name: file
 *          type: file
 *          required: true
 *      responses:
 *          200:
 *            description: model을 정상적으로 업로드 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Model'
 *          400:
 *            description: model 파일을 첨부하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post(
    '/upload/:speakerName',
    controller.getUser,
    multer.single('file'),
    controller.parseFile,
    controller.uploadModel,
    controller.createModelAndUpdateUserAfterUploadModel,
);
// model의 가중치 파일을 user 고유값의 파일 네임으로 업로드한다.

/**
 *  @swagger
 *  /api/v2/models/{speakerName}:
 *    get:
 *      tags:
 *      - Model
 *      summary: 특정 speakerName를 갖고 있는 model 찾기'
 *      description: 특정 speakerName를 갖고 있는 model 찾고 반환
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: speakerName
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: model을 정상적으로 가져온 경우
 *            schema:
 *              $ref: '#/definitions/Response_Model'
 *          404:
 *            description: user를 찾을 수 없는 경우, model을 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'

 */
router.get('/:speakerName', controller.getUser, controller.getModel);

/**
 *  @swagger
 *  /api/v2/models:
 *    get:
 *      tags:
 *      - Model
 *      summary: '모든 model을 리스트 형태로 반환'
 *      description: 모든 model을 리스트 형태로 반환
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          type: string
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *      responses:
 *          200:
 *            description: model을 배열 형태로 반환
 *            schema:
 *              $ref: '#/definitions/Response_Models'
 */
router.get('/', decodeToken, controller.getModels);

/**
 *  @swagger
 *  /api/v2/models/{speakerName}:
 *    patch:
 *      tags:
 *      - Model
 *      summary: '모델에 sampleSentenceUrl 추가'
 *      description: 모델에 sampleSentenceUrl 추가
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: speakerName
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: model을 변환
 *            schema:
 *              $ref: '#/definitions/Response_Model'
 *          400:
 *            description: speakerName이 명시되지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.patch('/:speakerName', controller.tts, controller.updateModel);

module.exports = router;
