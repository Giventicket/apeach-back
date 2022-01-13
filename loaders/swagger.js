const swaggerUi = require('swagger-ui-express'); 
const swaggereJsdoc = require('swagger-jsdoc'); 

module.exports = (app) => {
    const options = { 
        swaggerDefinition: { 
            info: { 
                title: 'Apeach-Back APIs', 
                version: '1.0.0', 
                description: 'descriptions for API methods', 
            }, 
            basePath: '/' 
        }, 
        apis: ['../routes/*.js', './swagger/*'] 
    }; 
    const specs = swaggereJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};