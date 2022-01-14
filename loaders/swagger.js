const swaggerUi = require('swagger-ui-express'); 
const swaggereJsdoc = require('swagger-jsdoc'); 

const swaggerDefinition = {
  info: {
    title: 'Apeach Backend Server [dubAI]',
    version: '1.0.0',
    description: 'description for Apeach Backend Server'
  },        
  host: `${process.env.IP_ADDRESS || "localhost"}:${process.env.PORT || 80}`,
  basePath: "/",
  contact: {
    email: "kendrick.seo@kakaobrain.com"
  }
};
module.exports = (app) => {
    const options = { 
      swaggerDefinition,
      apis: ['./loaders/*.js', './api/routes/v1/chunks/*.js', './api/routes/v1/audios/*.js'] 
    }; 
    const specs = swaggereJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
};


/** 
 *  @swagger
 *  definitions:
 *    Response_Chunk:
 *      properties:
 *        message: 
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/Chunk' 
 *    Response_Audio:
 *      properties:
 *        message: 
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/Audio' 
 * 
 *    Response_Chunks:
 *      properties:
 *        message: 
 *          type: string
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Chunk' 
 *    
 *    Response_Only_Message:
 *      properties:
 *        message: 
 *          type: string
 *        data:
 *          type: object
 * 
 *    Chunk_For_Patch:
 *      properties:
 *        status:
 *          type: string
 *        source_wave_url:
 *          type: string 
 *        target_wave_url:
 *          type: string
 *        segments:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              start_time: 
 *                type: number
 *              end_time: 
 *                type: number
 *              source_text:
 *                type: string
 *              target_text:
 *                type: string
 * 
 *    Chunk: 
 *      properties:
 *        _id:   
 *          type: string
 *        status:
 *          type: string
 *        source_wave_url:
 *          type: string 
 *        target_wave_url:
 *          type: string
 *        segments:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              start_time: 
 *                type: number
 *              end_time: 
 *                type: number
 *              source_text:
 *                type: string
 *              target_text:
 *                type: string
 *        createdAt:
 *          type: string
 * 
 *    Audio: 
 *      properties:
 *        kind:   
 *          type: string
 *        id:
 *          type: string
 *        selfLink:
 *          type: string 
 *        mediaLink:
 *          type: string
 *        name:
 *          type: string
 *        bucket:
 *          type: string
 *        generation:
 *          type: string
 *        metageneration:
 *          type: string
 *        contentType:
 *          type: string
 *        storageClass:
 *          type: string
 *        size:
 *          type: string
 *        md5Hash:
 *          type: string
 *        crc32c:
 *          type: string
 *        etag:
 *          type: string
 *        timeCreated:
 *          type: string
 *        updated:
 *          type: string
 *        timeStorageClassUpdated:
 *          type: string
 */