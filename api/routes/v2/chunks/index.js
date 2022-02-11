const express = require('express');
const controller = require('./controllers/index');
const decodeToken = require('../middlewares/decodeToken');

const router = express.Router();

/**
 *  @swagger
 *  /api/v2/chunks:
 *    post:
 *      tags:
 *      - Chunk
 *      summary: 'chunk 생성'
 *      description: 오디오를 구글 버켓에 업로드하여 url을 받아오고 그것을 첨부하여 chunk를 생성한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          type: string
 *        - in: formData
 *          name: file
 *          type: file
 *          required: true
 *      responses:
 *          201:
 *            description: chunk 생성이 정상적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Chunk'
 *          400:
 *            description: 파일을 첨부하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip conflict)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: 로그인 한 user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          452:
 *            description: 메타 데이터가 없는 경우 - 멀티 파트 데이터가 아닐 때와 동일
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          453:
 *            description: audio 파일이 아닌 경우(ex. video, image)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          454:
 *            description: audio 파일의 길이가 10분이 초과되는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post(
    '/',
    decodeToken,
    controller.parseForm,
    controller.checkFile,
    controller.preprocess,
    controller.uploadAudio,
    controller.createChunk,
    controller.updateUserAfterCreateChunk,
);
// [post] chunk 생성하기

/**
 *  @swagger
 *  /api/v2/chunks/{id}:
 *    get:
 *      tags:
 *      - Chunk
 *      summary: '개별 chunk 조회'
 *      description: 하나의 chunk를 조회한다.
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: chunk가 정상적 조회 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Chunk'
 *          400:
 *            description: 잘못된 형식의 id를 입력하는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: 요청한 id를 찾을 수 없을 떄
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.get('/:id', controller.getChunk);
// [get] 매칭 되는 chunk 가져오기

/**
 *  @swagger
 *  /api/v2/chunks/{id}:
 *    patch:
 *      tags:
 *      - Chunk
 *      summary: 'chunk의 갱신'
 *      description: chunk를 update 한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *        - in: body
 *          name: JSON
 *          schema:
 *            $ref: '#/definitions/Chunk_For_Patch'
 *      responses:
 *          200:
 *            description: chunk가 정상적으로 update 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Chunk'
 *          400:
 *            description: 잘못된 형식의 id를 입력하는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: 요청한 id의 chunk를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.patch('/:id', controller.updateChunk);
// [update] chunk update 하기

/**
 *  @swagger
 *  /api/v2/chunks/{id}:
 *    delete:
 *      tags:
 *      - Chunk
 *      summary: 'chunk의 삭제'
 *      description: chunk를 삭제하고 google bucket에 있는 오디오 파일을 삭제, user.chunks에서 해당 chunk를 삭제한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          type: string
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: chunk가 정상적으로 삭제된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          400:
 *            description: 잘못된 형식의 id를 입력하는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip conflict)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: 요청한 id의 chunk를 찾을 수 없는 경우, 로그인 한 user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete(
    '/:id',
    decodeToken,
    controller.deleteChunk,
    controller.updateUserAfterDeleteChunk,
);
// [delete] id에 매칭되는 chunk 하나 삭제하기

module.exports = router;
