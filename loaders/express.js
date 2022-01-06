const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const indexRouter = require('../api/routes/index');
const {logger} = require('./logger');

module.exports = (app) => {
    app.set('port', process.env.PORT || 3000);
    
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({ credentials: true }));
    app.use('/api', indexRouter);
    app.use((req, res, next) => {
        const err = new Error(`${req.method} ${req.url} no routers!`);
        error.status = 404;
        next(error);
    });
    app.use((err, req, res, next) => {
        logger.error(`error status: ${(err.status || 500)}, error message: ${err.message}`);
        res.status(err.status || 500).json({message: err.message, data: { }});
    });
};