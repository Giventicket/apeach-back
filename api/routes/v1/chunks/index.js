const express = require('express');
const controller = require('./controllers/index');
const middlewares = require('../../../middlewares/index');

const router = express.Router();

/** 
 *  @swagger 
 *  /api/v1/chunks: 
 *    post: 
 *      tags: 
 *      - Chunk 
 *      summary: 'chunk 생성' 
 *      description: chunk를 생성한다.
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
 *              - source_wave_url  
 *            properties:
 *              source_wave_url:
 *                type: string
 *      responses: 
 *          201: 
 *            description: chunk 생성이 정상적으로 된 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Chunk'
 *          400:
 *            description: source_wave_url를 명시하지 않은 경우
 *            schema:
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.post('/', middlewares.isRequired("body", 'source_wave_url', true), controller.createChunk);
// [post] chunk 생성하기

/** 
 *  @swagger 
 *  /api/v1/chunks/{id}:
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
router.get('/:id', middlewares.isValidID, controller.getChunk);
// [get] 매칭 되는 chunk 가져오기

/** 
 *  @swagger 
 *  /api/v1/chunks: 
 *    get: 
 *      tags: 
 *      - Chunk 
 *      summary: '모든 chunks 조회' 
 *      description: 모든 chunks를 조회한다.
 *      produces:
 *        - application/json
 *      responses: 
 *          200: 
 *            description: chunk가 정상적으로 조회 된 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Chunks'
 */
router.get('/', controller.getChunks);
// [get] 전체 chunk 가져오기


/** 
 *  @swagger 
 *  /api/v1/chunks/{id}: 
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
router.patch('/:id', middlewares.isValidID, controller.updateChunk);
// [update] chunk update 하기

/** 
 *  @swagger 
 *  /api/v1/chunks/{id}: 
 *    delete: 
 *      tags: 
 *      - Chunk 
 *      summary: 'chunk의 삭제' 
 *      description: chunk를 삭제하고 google bucket에 있는 오디오 파일을 삭제한다.
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
 *            description: chunk가 정상적으로 삭제된 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 *          400: 
 *            description: 잘못된 형식의 id를 입력하는 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 *          404: 
 *            description: 요청한 id의 chunk를 찾을 수 없는 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete("/:id", middlewares.isValidID, controller.deleteChunk);
// [delete] id에 매칭되는 chunk 하나 삭제하기


/** 
 *  @swagger 
 *  /api/v1/chunks: 
 *    delete: 
 *      tags: 
 *      - Chunk 
 *      summary: '모든 chunks의 삭제' 
 *      description: 모든 chunks를 삭제하고 google bucket에 있는 오디오 파일을 삭제한다.
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      responses: 
 *          200: 
 *            description: chunks가 정상적으로 삭제된 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 *          400: 
 *            description: 잘못된 형식의 id를 입력하는 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 *          404: 
 *            description: 요청한 id의 chunk를 찾을 수 없는 경우
 *            schema: 
 *              $ref: '#/definitions/Response_Only_Message'
 */
router.delete("/", controller.deleteChunks);
// [delete] 모두 삭제


module.exports = router;