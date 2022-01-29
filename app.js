const express = require('express');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const expressLoader = require('./loaders/express');
const mongooseLoader = require('./loaders/mongoose');
const swaggerLoader = require('./loaders/swagger');
const jobSendWebhooks = require('./schedulers/jobSendWebhooks');
const jobDeleteAudios = require('./schedulers/jobDeleteAudios');

const app = express();

app.use(cookieParser());
swaggerLoader(app);
expressLoader(app);

module.exports = app.listen(app.get('port'), () => {
    if (process.env.NODE_ENV !== 'test')
        console.log(app.get('port'), '번 포트에서 대기 중..!');
});

if (process.env.NODE_ENV !== 'test') {
    mongooseLoader();
    jobSendWebhooks();
    jobDeleteAudios();
    if (
        process.env.NODE_ENV === 'production' &&
        process.env.NODE_APP_INSTANCE == 0
    ) {
        jobSendWebhooks();
        jobDeleteAudios();
    }
}
