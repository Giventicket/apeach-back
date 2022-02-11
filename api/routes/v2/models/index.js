const express = require('express');
const controller = require('./controllers/index');

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
 */
router.post(
    '/upload/:speakerName',
    controller.parseForm,
    controller.uploadModel,
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
 *          400:
 *            description: model 파일을 첨부하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.get('/:speakerName', controller.getModel);

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
 *      responses:
 *          200:
 *            description: model을 배열 형태로 반환
 *            schema:
 *              $ref: '#/definitions/Response_Models'
 */
router.get('/', controller.getModels);

module.exports = router;
