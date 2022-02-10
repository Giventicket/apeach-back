const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
    info: {
        title: 'Apeach Backend Server [dubAI]',
        version: '1.0.0',
        description: 'description for Apeach Backend Server',
    },
    host: `${process.env.IP_ADDRESS || 'localhost'}:${process.env.PORT || 80}`,
    basePath: '/',
    contact: {
        email: 'kendrick.seo@kakaobrain.com',
    },
};
module.exports = app => {
    const root = path.resolve(__dirname, '../');
    const options = {
        swaggerDefinition,
        apis: [
            root + '/loaders/*.js',
            root + '/api/routes/v1/chunks/*.js',
            root + '/api/routes/v1/audios/*.js',
            root + '/api/routes/v1/samples/*.js',
            root + '/api/routes/v1/auth/*.js',
            root + '/api/routes/v1/ai/*.js',
            root + '/api/routes/v1/models/*.js',
            root + '/api/routes/v1/users/*.js',
        ],
    };
    const specs = swaggereJsdoc(options);
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(specs, { explorer: true }),
    );
};

/**
 *  @swagger
 *  definitions:
 *    Response_Models:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Model'
 *
 *    Response_Model:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/Model'
 *
 *    Response_UserWithAccessToken:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/UserWithAccessToken'
 *
 *    Response_AccessToken:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/AccessToken'
 *
 *    Response_User:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/User'
 *
 *    Response_Samples:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Sample'
 *
 *    Response_Sample:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/Sample'
 *
 *    Response_Chunk:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/Chunk'
 *    Response_File:
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          $ref: '#/definitions/File'
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
 *    Sample:
 *      properties:
 *        utteranceId:
 *          type: number
 *        wave_url:
 *          type: string
 *        createdAt:
 *          type: string
 *
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
 *    File:
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
 *        duration:
 *          type: number
 *
 *
 *    User:
 *      properties:
 *        name:
 *          type: string
 *        samples:
 *          type: array
 *          items:
 *              $ref: '#/definitions/Sample'
 *        chunks:
 *          type: array
 *          items:
 *              $ref: '#/definitions/Chunk'
 *        samplesAudioCnt:
 *          type: number
 *        chunksAudioCnt:
 *          type: number
 *
 *    UserWithAccessToken:
 *      properties:
 *        name:
 *          type: string
 *        samples:
 *          type: array
 *          items:
 *              $ref: '#/definitions/Sample'
 *        chunks:
 *          type: array
 *          items:
 *              $ref: '#/definitions/Chunk'
 *        samplesAudioCnt:
 *          type: number
 *        chunksAudioCnt:
 *          type: number
 *        accesstoken:
 *          type: string
 *
 *    AccessToken:
 *      properties:
 *        accessToken:
 *          type: string
 *
 *    Model:
 *      properties:
 *        speakerId:
 *          type: string
 *        model_url:
 *          type: string
 *
 */
