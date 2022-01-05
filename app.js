const express = require('express');
require("dotenv").config();

const mongooseLoader = require('./loaders/mongoose');
const expressLoader = require('./loaders/express');
const gcStorageLoader = require('./loaders/gcStorage');

const app = express();

mongooseLoader();
gcStorageLoader(app);
expressLoader(app);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중..!)');
});