const express = require('express');
const controller = require('./controllers/index');
const decodeToken = require('../middlewares/decodeToken');
const isNameAndPasswordNotNull = require('../middlewares/isNameAndPasswordNotNull');
const isUtteranceIdAndUrlNotNull = require('../middlewares/isUtteranceIdAndUrlNotNull');

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
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip conflict)
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
 */
router.post('/login', isNameAndPasswordNotNull, controller.login);

/**
 *  @swagger
 *  /api/v2/auth/sample:
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
 *        - in: body
 *          name: JSON
 *          schema:
 *            type: object
 *            required:
 *              - utteranceId
 *              - waveUrl
 *            properties:
 *              utteranceId:
 *                type: number
 *              waveUrl:
 *                type: string
 *      responses:
 *          200:
 *            description: sample의 update가 user에 성공적으로 반영된 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          400:
 *            description: sample를 찾을 수 없는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 *          404:
 *            description: access token이 유효하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.patch(
    '/sample',
    isUtteranceIdAndUrlNotNull,
    decodeToken,
    controller.updateSample,
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
 *      responses:
 *          200:
 *            description: 로그아웃을 정상적으로 할 경우
 *            schema:
 *              $ref: '#/definitions/Response_User'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip conflict)
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
 *              $ref: '#/definitions/Response_AccessToken'
 *          401:
 *            description: 정상적인 로그인을 할 수 없는 경우(refreshToken을 DB에서 찾을 수 없음, refreshToken 만료, Ip conflict)
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/silentrefresh', controller.silentRefresh);
//silentRefresh 진행

module.exports = router;
