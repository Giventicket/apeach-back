const express = require('express');
require('dotenv').config();

const expressLoader = require('./loaders/express');
const mongooseLoader = require('./loaders/mongoose');
const swaggerLoader = require('./loaders/swagger');
const jobSendWebhooks = require('./schedulers/jobSendWebhooks');
const jobdDeleteFiles = require('./schedulers/jobdDeleteFiles');

const app = express();

swaggerLoader(app);
expressLoader(app);

module.exports = app.listen(app.get('port'), () => {
    if (process.env.NODE_ENV !== 'test')
        console.log(app.get('port'), '번 포트에서 대기 중..!');
});

if (process.env.NODE_ENV !== 'test') {
    mongooseLoader();
    if (process.env.NODE_APP_INSTANCE == 0) {
        jobSendWebhooks();
        jobdDeleteFiles();
    }
}
