const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('../utils/logger');

const indexRouter = require('../api/routes/index');

const stream = {
    write: message => {
        logger.info(message);
    },
};

const combined =
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

module.exports = app => {
    app.set('port', process.env.PORT || 80);
    app.use(
        expressSession({
            resave: false,
            saveUninitialized: false,
            secret: process.env.COOKIE_SECRET,
            proxy: true,
            cookie: {
                // httpOnly: true,
                // secure: process.env.NODE_ENV === 'dev' ? false : true,
                sameSite: process.env.NODE_ENV === 'dev' ? false : 'none',
            },
        }),
    );
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({ credentials: true, origins: '*' }));
    app.use(morgan(combined, { stream }));
    app.use('/api', indexRouter);
    app.use('*', (req, res, next) => {
        const err = new Error(`${req.method} ${req.url} no routers!`);
        err.status = 400;
        next(err);
    });
    app.use((err, req, res, next) => {
        if (err instanceof mongoose.Error) err.status = 400;
        logger.error(
            `status: ${err.status || err.code || 500}, message: ${err}\n`,
        );
        res.status(err.status || err.code || 500).json({
            message: err.message,
            data: {},
        });
    });
};
