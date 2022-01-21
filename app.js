const express = require('express');
require('dotenv').config();

const loggerLoader = require('./loaders/logger');
const expressLoader = require('./loaders/express');
const gcStorageLoader = require('./loaders/gcStorage');
const mongooseLoader = require('./loaders/mongoose');
const swaggerLoader = require('./loaders/swagger');
const jobWebhookLoader = require('./loaders/jobWebhook');
const jobBucketLoader = require('./loaders/jobBucket');

const app = express();

gcStorageLoader(app);
loggerLoader(app);
swaggerLoader(app);
expressLoader(app);

module.exports = app.listen(app.get('port'), () => {
    if (process.env.NODE_ENV !== 'test')
        console.log(app.get('port'), '번 포트에서 대기 중..!');
});

if (process.env.NODE_ENV !== 'test') {
    mongooseLoader();
    jobWebhookLoader(app);
    if (
        process.env.NODE_ENV === 'production' &&
        process.env.NODE_APP_INSTANCE == 0
    ) {
        jobWebhookLoader(app);
    }
}
