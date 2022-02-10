const express = require('express');
const controller = require('./controllers/index');

const router = express.Router();

/**
 *  @swagger
 *  /api/v1/models/upload/{speakerId}:
 *    post:
 *      tags:
 *      - Model
 *      summary: 'model 파일의 업로드'
 *      description: audio를 전처리하고 google storage의 bucket에 업로드합니다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: speakerId
 *          type: string
 *          required: true
 *        - in: formData
 *          name: model
 *          type: file
 *          required: true
 *      responses:
 *          200:
 *            description: model을 정상적으로 업로드 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_File'
 *          400:
 *            description: model 파일을 첨부하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/upload/:speakerId', controller.parseForm, controller.uploadModel);
// model의 가중치 파일을 user 고유값의 파일 네임으로 업로드한다.

/**
 *  @swagger
 *  /api/v1/models/{id}:
 *    get:
 *      tags:
 *      - Model
 *      summary: '특정 id를 갖고 있는 model 찾기'
 *      description: 특정 id를 갖고 있는 model 찾고 반환
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: model을 정상적으로 가져온 경우
 *            schema:
 *              $ref: '#/definitions/Response_Model'
 *          400:
 *            description: model 파일을 첨부하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.get('/:id', controller.getModel);

/**
 *  @swagger
 *  /api/v1/models:
 *    get:
 *      tags:
 *      - Model
 *      summary: '모든 model을 리스트 형태로 반환'
 *      description: 모든 model을 리스트 형태로 반환
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      responses:
 *          200:
 *            description: model을 배열 형태로 반환
 *            schema:
 *              $ref: '#/definitions/Response_Models'
 */
router.get('/', controller.getModels);

module.exports = router;
