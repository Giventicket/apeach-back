const express = require('express');
const controller = require('./controller/index');
                       
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
 */
router.post('/upload/preprocess', controller.parseForm, controller.preprocess, controller.uploadFile);
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
 */
router.post('/upload', controller.parseForm, controller.uploadFile);
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