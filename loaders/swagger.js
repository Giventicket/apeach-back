const swaggerUi = require('swagger-ui-express'); 
const swaggereJsdoc = require('swagger-jsdoc'); 

module.exports = (app) => {
    const options = { 
      swaggerDefinition: {
        // 정보
        info: {
          title: 'node js test app',
          version: '1.0.0',
          description: 'Make For node js test.'
        },
        // 주소
        host: "localhost:3000",
        // 기본 root path
        basePath: "/",
        contact: {
          email: "rokking1@naver.com"
        },
        // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
        components: {
          res: {
            BadRequest: {
              description: '잘못된 요청.',
              schema: {
                $ref: '#/components/errorResult/Error'
              }
            },
            Forbidden: {
              description: '권한이 없슴.',
              schema: {
                $ref: '#/components/errorResult/Error'
              }
            },
            NotFound: {
              description: '없는 리소스 요청.',
              schema: {
                $ref: '#/components/errorResult/Error'
              }
            }
          },
          errorResult: {
            Error: {
              type: 'object',
              properties: {
                errMsg: {
                  type: 'string',
                  description: '에러 메시지 전달.'
                }
              }
            }
          }
        },
        schemes: ["http", "https"], // 가능한 통신 방식
        definitions:  // 모델 정의 (User 모델에서 사용되는 속성 정의)
          {
            'User': {
              type: 'object',
              properties: {
                id: {
                  type: 'string'
                },
                age: {
                  type: 'integer'
                },
                addr: {
                  type: 'string'
                }
              }
            }
          }
      }, 
        apis: ['./api/routes/v1/chunks/controller/createChunk.js', './models/chunk.js', "./app.js"] 
    }; 
    const specs = swaggereJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
};