const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

require("dotenv").config();

const connect = require('./schemas');
const chunksRouter = require('./routes/chunks');
const audiosRouter = require('./routes/audios');

const app = express();
app.set('port', process.env.PORT || 3000);
connect();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ credentials: true }));

app.use('/chunks', chunksRouter);
app.use('/audios', audiosRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} no routers!`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.log("last err", err);
    console.log(typeof(err));
    res.status(err.status || 500).json({message: err.message, data: { }});
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중...)');
});