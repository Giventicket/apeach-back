const express = require('express');
const controller = require('./controllers/index');

const router = express.Router();

router.post('/', controller.createUser);
// [post] user 생성하기

/**
 *  @swagger
 *  /api/v1/users/samples/{name}:
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
 *          name: name
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
router.get('/samples/:name', controller.getSamplesbyName);
// [get] 매칭 되는 user의 samples 가져오기

router.get('/:id', controller.getUser);
// [get] 매칭 되는 user 가져오기

router.get('/', controller.getUsers);
// [get] 전체 user 가져오기

router.patch('/:id', controller.updateUser);
// [update] user update 하기

router.delete('/:id', controller.deleteUser);
// [delete] id에 매칭되는 user 삭제하기

router.delete('/', controller.deleteUsers);
// [delete] 모두 삭제

module.exports = router;
