const express = require('express');
const controller = require('./controllers/index');

const router = express.Router();

/**
 *  @swagger
 *  /api/v1/samples:
 *    post:
 *      tags:
 *      - Sample
 *      summary: 'sample 생성'
 *      description: sample을 생성한다.
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
 *              - turn
 *              - text
 *              - wave_url
 *            properties:
 *              turn:
 *                type: number
 *              text:
 *                type: string
 *              wave_url:
 *                type: string
 *      responses:
 *          201:
 *            description: sample 생성이 정상적으로 된 경우
 *            schema:
 *              $ref: '#/definitions/Response_Sample'
 *          400:
 *            description: turn, text, wave_url을 명시하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */

router.post('/', controller.createSample);
// [post] sample 생성하기

router.get('/:id', controller.getSample);
// [get] 매칭 되는 sample 가져오기

router.get('/', controller.getSamples);
// [get] 전체 sample 가져오기

router.patch('/:id', controller.updateSample);
// [update] sample update 하기

router.delete('/:id', controller.deleteSample);
// [delete] id에 매칭되는 sample 삭제하기

router.delete('/', controller.deleteSamples);
// [delete] 모두 삭제

module.exports = router;
