const express = require('express');

const Multer = require('multer');
const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 500 * 1024 * 1024,
});

const controller = require('./controllers/index');
const decodeToken = require('../middlewares/decodeToken');
const isEmailAndPasswordNotNull = require('../middlewares/isEmailAndPasswordNotNull');

const router = express.Router();

/**
 *  @swagger
 *  /api/v2/auth/signup:
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
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *          201:
 *            description: user의 회원가입이 정상적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          400:
 *            description: name, password, email가 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          409:
 *            description: name이 중복되는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/signup', controller.signup);
//회원가입

/**
 *  @swagger
 *  /api/v2/auth/signout:
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
 *      responses:
 *          200:
 *            description: user의 회원탈퇴가 정상적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete('/signout', decodeToken, controller.signout);

/**
 *  @swagger
 *  /api/v2/auth/login:
 *    post:
 *      tags:
 *      - Auth
 *      summary: 'user 로그인'
 *      description: user의 access token을 생성한다. refreshToken을 쿠기에 저장(3h 만료), accessToken 발급(30m 만료)
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
 *              - email
 *              - password
 *            properties:
 *              email:
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
 *          401:
 *            description: password가 틀린 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: user를 찾을 수 없느 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/login', isEmailAndPasswordNotNull, controller.login);

/**
 *  @swagger
 *  /api/v2/auth/sample/{utteranceId}:
 *    patch:
 *      tags:
 *      - Auth
 *      summary: "sample를 user의 samples에서 update"
 *      description: user의 samples에 sample를 update한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *        - in: path
 *          name: utteranceId
 *          type: string
 *          required: true
 *        - in: formData
 *          name: file
 *          type: file
 *          required: true
 *      responses:
 *          200:
 *            description: sample의 update가 user에 성공적으로 반영된 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          400:
 *            description: sample를 찾을 수 없는 경우, 파일을 첨부하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: 로그인 되지 않은 유저인 경우
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
router.patch(
    '/sample/:utteranceId',
    decodeToken,
    controller.checkSample,
    multer.single('file'),
    controller.parseFile,
    controller.checkFile,
    controller.preprocess,
    controller.uploadAudio,
    controller.updateUserAfterUploadAudio,
);
//user의 samples의 sample 업데이트

/**
 *  @swagger
 *  /api/v2/auth/logout:
 *    delete:
 *      tags:
 *      - Auth
 *      summary: "logout"
 *      description: DB에서 refreshToken을 삭제한다.
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
 *            description: 로그아웃을 정상적으로 할 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete('/logout', decodeToken, controller.logout);
//user의 logout 진행

/**
 *  @swagger
 *  /api/v2/auth/silentrefresh:
 *    post:
 *      tags:
 *      - Auth
 *      summary: "silent refresh"
 *      description: silent refresh 실행
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      responses:
 *          200:
 *            description: 토큰의 정상적인 발급
 *            schema:
 *              $ref: '#/definitions/Response_UserWithAccessToken'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/silentrefresh', controller.silentRefresh);
//silentRefresh 진행

/**
 *  @swagger
 *  /api/v2/auth/complete/{agreed}:
 *    patch:
 *      tags:
 *      - Auth
 *      summary: "자신의 목소리가 울려 퍼지는 것을 동의, agreed에는 true, false를 입력"
 *      description: 자신의 목소리가 대중에게 울려 퍼지는 것을 동의한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          type: string
 *          required: true
 *        - in: body
 *          name: JSON
 *          schema:
 *            type: object
 *            required:
 *              - agreed
 *              - sampleFinished
 *            properties:
 *              agreed:
 *                type: string
 *              sampleFinished:
 *                type: string
 *      responses:
 *          200:
 *            description: 토큰의 정상적인 발급
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          400:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip 주소가 매칭이 안됨)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: user를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.patch('/userinfo', decodeToken, controller.updateUser);

module.exports = router;
