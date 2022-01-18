const express = require('express');
const controller = require('./controllers/index');
                       
const router = express.Router();


/** 
 *  @swagger 
 *  /api/v1/audios/upload/preprocess: 
 *    post: 
 *      tags: 
 *      - Audio 
 *      summary: 'audio 전처리 후 업로드' 
 *      description: audio를 전처리하고 google storage의 bucket에 업로드합니다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
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
router.post('/upload/preprocess', controller.parseForm, controller.checkfile, controller.preprocess, controller.uploadFile);
// audio 전처리 후 저장하기

/** 
 *  @swagger 
 *  /api/v1/audios/upload: 
 *    post: 
 *      tags: 
 *      - Audio 
 *      summary: 'audio 업로드' 
 *      description: audio를 google storage의 bucket에 업로드합니다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
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
router.post('/upload', controller.parseForm, controller.checkfile, controller.uploadFile);
// audio 저장하기



/** 
 *  @swagger 
 *  /api/v1/audios/{filename}: 
 *    delete: 
 *      tags: 
 *      - Audio 
 *      summary: 'audio 삭제' 
 *      description: google storage의 bucket에서 filename에 해당하는 음성파일을 삭제합니다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: filename
 *          type: string
 *          required: true
 *      responses: 
 *          200: 
 *            description: audio가 정상적으로 삭제 된 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 *          400: 
 *            description: audio의 파일이름을 명시하지 않은 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 *          404: 
 *            description: 해당 filename을 가진 audio를 찾을 수 없는 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete('/:filename', controller.deleteFile);
 // audio 삭제하기

module.exports = router;