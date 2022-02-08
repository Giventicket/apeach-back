const express = require('express');
const controller = require('./controllers/index');
const router = express.Router();
const decodeToken = require('../middlewares/decodeToken');

/**
 *  @swagger
 *  /api/v1/ai/stt/{option}/{id}:
 *    post:
 *      tags:
 *      - AI
 *      summary: 'speach to text'
 *      description: ai sever에 stt 요청 후 update된 chunk 반환, option에는 long과 short가 있음. id는 chunk의 id임.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: option
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: stt가 정상적으로 완료되었을 경우 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Chunk'
 *          401:
 *            description: header를 명시했을 때 jwt 토큰의 기간이 만료된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: header를 명시했을 때 user를 찾을 수 없는 경우, 구글 버켓에서 파일을 찾을 수 없는 경우, chunk를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post(
    '/stt/:option/:id',
    decodeAccessToken,
    controller.getChunk,
    controller.stt,
);

/**
 *  @swagger
 *  /api/v1/ai/translate/{id}:
 *    post:
 *      tags:
 *      - AI
 *      summary: 'translate'
 *      description: ai sever에 translate 요청 후 update된 chunk 반환. id는 chunk의 id 임.
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
 *            description: translate가 정상적으로 완료되었을 경우 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Chunk'
 *          401:
 *            description: header를 명시했을 때 jwt 토큰의 기간이 만료된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: header를 명시했을 때 user를 찾을 수 없는 경우, 구글 버켓에서 파일을 찾을 수 없는 경우, chunk를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message' */
router.post('/translate/:id', controller.getChunk, controller.translate);

/**
 *  @swagger
 *  /api/v1/ai/tts/{speakerId}/{id}:
 *    post:
 *      tags:
 *      - AI
 *      summary: 'text to speach'
 *      description: ai sever에 tts 요청 후 update된 chunk 반환
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: speakerId
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: tts가 정상적으로 완료되었을 경우 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Chunk'
 *          401:
 *            description: header를 명시했을 때 jwt 토큰의 기간이 만료된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: header를 명시했을 때 user를 찾을 수 없는 경우, 구글 버켓에서 파일을 찾을 수 없는 경우, chunk를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post(
    '/tts/:speakerId/:id',
    decodeToken,
    controller.getChunk,
    controller.tts,
);

module.exports = router;
