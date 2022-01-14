const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../asyncErrorWrapper.js');

/** 
 *  @swagger 
 *  /qna/specific/{qnaIdx}: 
 *    get: 
 *      tags: 
 *      - Q&A 
 *      summary: 'Q&A 상세조회' 
 *      description: Q&A 상세조회 
 *      parameters: 
 *      - name: token 
 *        in: header 
 *        description: 헤더에 토큰을 입력하세요 
 *        required: true 
 *        schema: 
 *          type: string 
 *        examples: 
 *          Sample: 
 *              value: example 
 *              summary: A sample token 
 *        style: simple 
 *      - name: qnaIdx 
 *        in: path 
 *        required: true 
 *        schema: 
 *          type: string 
 *        examples: 
 *          Sample: 
 *            value: 1816 
 *          summary: A sample Q&A Idx 
 *        style: simple
 *      responses: 
 *          200: 
 *            description: Q&A 해당 index 상세 조회 성공 
 *            content: 
 *              application/json:  
 *                schema: 
 *                  $ref: '#/components/schemas/User' 
 *          403: 
 *            description: 헤더의 토큰 값이 만료됐을 때 
 *            content: 
 *              application/json: 
 *                schema: 
 *                  $ref: '#/components/schemas/expiredToken' 
 *          400: 
 *            description: params 값이 없을 때 
 *            content: 
 *              application/json: 
 *                schema: 
 *                  $ref: '#/components/schemas/noParams' 
 *          404: 
 *            description: DB에서 필요한 값을 찾지 못할 때 
 *            content: 
 *              application/json: 
 *                schema: 
 *                  $ref: '#/components/schemas/wrongDBIndex' 
 */



const createChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.create({
        source_wave_url: req.body.source_wave_url,
    });
    res.status(201).json({ 
        message: `Create success[create ${ chunk._id }}]`, 
        data: chunk 
    });
});

module.exports = createChunk;