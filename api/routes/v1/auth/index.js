const express = require('express');
const controller = require('./controllers/index');
const audioController = require('../audios/controllers/index');
const decodeAccessToken = require('../middlewares/decodeAccessToken');
const isNameAndPasswordNotNull = require('../middlewares/isNameAndPasswordNotNull');

const router = express.Router();

/**
 *  @swagger
 *  /api/v1/auth/signin:
 *    post:
 *      tags:
 *      - Auth
 *      summary: 'user 회원가입'
 *      description: user를 생성한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: JSON
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *          201:
 *            description: user의 회원가입이 정상적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          400:
 *            description: name, password가 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: 중복된 사용자가 있는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/signin', controller.signin);
//회원가입

/**
 *  @swagger
 *  /api/v1/auth/signout:
 *    delete:
 *      tags:
 *      - Auth
 *      summary: 'user 회원탈퇴'
 *      description: user를 삭제한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: user의 회원탈퇴가 정상적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete('/signout', decodeAccessToken, controller.signout);

/**
 *  @swagger
 *  /api/v1/auth/login:
 *    post:
 *      tags:
 *      - Auth
 *      summary: 'user 로그인'
 *      description: user의 access token을 생성한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: JSON
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *          200:
 *            description: user의 로그인이 성공적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_UserWithAccessToken'
 *          400:
 *            description: request body에 name, password가 명시되지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/login', isNameAndPasswordNotNull, controller.login);

/**
 *  @swagger
 *  /api/v1/auth/upload/preprocess/{option}:
 *    post:
 *      tags:
 *      - Auth
 *      summary: '전처리 후 오디오 파일 업로드'
 *      description: 전처리 후 오디오 파일을 google bucket의 audio/${user.name}/${option}/ 에 저장한다. option은 sample과 chunk 두가지이다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: option
 *          type: string
 *          required: true
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *        - in: formData
 *          name: audio
 *          type: file
 *          required: true
 *      responses:
 *          200:
 *            description: audio가 정상적으로 업로드 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Audio'
 *          400:
 *            description: audio를 첨부하지 않은 경우
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
    '/upload/preprocess/:option',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    audioController.preprocess,
    controller.uploadFile,
);
// 전처리 후 ${user.name}/chunk의 폴더에 음성파일 업로드

/**
 *  @swagger
 *  /api/v1/auth/upload/{option}:
 *    post:
 *      tags:
 *      - Auth
 *      summary: '오디오 파일 업로드'
 *      description: 오디오 파일을 google bucket의 audio/${user.name}/${option}/ 에 저장한다. option은 sample과 chunk 두가지이다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: option
 *          type: string
 *          required: true
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *        - in: formData
 *          name: audio
 *          type: file
 *          required: true
 *      responses:
 *          200:
 *            description: audio가 정상적으로 업로드 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Audio'
 *          400:
 *            description: audio를 첨부하지 않은 경우
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
    '/upload/:option',
    decodeAccessToken,
    audioController.parseForm,
    audioController.checkFile,
    controller.uploadFile,
);
// ${user.name}/chunk의 폴더에 음성파일 업로드

/**
 *  @swagger
 *  /api/v1/auth/chunk/{chunkId}:
 *    post:
 *      tags:
 *      - Auth
 *      summary: "생성된 chunk를 user의 chunks에 push"
 *      description: user의 chunks에 chunk를 넣는다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: chunkId
 *          type: string
 *          required: true
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: chunk의 push가 user에 성공적으로 반영된 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/chunk/:id', decodeAccessToken, controller.addChunk);
//user의 chunks에 하나 추가하기

/**
 *  @swagger
 *  /api/v1/auth/chunk/{chunkId}:
 *    delete:
 *      tags:
 *      - Auth
 *      summary: "chunk를 user의 chunks에 remove"
 *      description: user의 chunks에 chunk를 제거한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: chunkId
 *          type: string
 *          required: true
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: chunk의 remove가 user에 성공적으로 반영된 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete('/chunk/:id', decodeAccessToken, controller.removeChunk);
//user의 chunks에서 하나 제거하기

/**
 *  @swagger
 *  /api/v1/auth/sample/{sampleId}:
 *    post:
 *      tags:
 *      - Auth
 *      summary: "sample를 user의 samples에 push"
 *      description: user의 samples에 sample를 넣는다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: sampleId
 *          type: string
 *          required: true
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: sample의 remove가 user에 성공적으로 반영된 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/sample/:id', decodeAccessToken, controller.addSample);
//user의 samples에 하나 추가하기

/**
 *  @swagger
 *  /api/v1/auth/sample/{sampleId}:
 *    delete:
 *      tags:
 *      - Auth
 *      summary: "sample를 user의 samples에 remove"
 *      description: user의 samples에 sample를 제거한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: sampleId
 *          type: string
 *          required: true
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: sample의 remove가 user에 성공적으로 반영된 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete('/sample/:id', decodeAccessToken, controller.removeSample);
//user의 samples에서 하나 제거하기

module.exports = router;
