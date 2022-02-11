const express = require('express');
const controller = require('./controllers/index');

const router = express.Router();

/**
 *  @swagger
 *  /api/v2/users/samples/{userName}:
 *    get:
 *      tags:
 *      - User
 *      summary: 'user의 samples 조회'
 *      description: user의 samples 조회한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: userName
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *            description: samples의 조회가 성공한 경우
 *            schema:
 *              $ref: '#/definitions/Response_Sample'
 *          404:
 *            description: user가 존재하지 않는 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.get('/samples/:userName', controller.getSamplesbyName);
// [get] 매칭 되는 user의 samples 가져오기

module.exports = router;
