const express = require('express');
const cors = require('cors');

const indexRouter = require('../api/routes/index');

module.exports = (app) => {
    app.set('port', process.env.PORT || 80);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({ credentials: true }));
    app.use('/api', indexRouter);
    app.use('*', (req, res, next) => {
        const err = new Error(`${ req.method } ${ req.url } no routers!`);
        err.status = 400;
        next(err);
    });
    app.use((err, req, res, next) => {
        console.log(err);
        req.logger.error(`status: ${(err.status || err.code || 500)}, message: ${ err }\n`);
        res.status(err.status || err.code || 500).json({message: err.message, data: { }});
    });
};