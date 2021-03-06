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
    app.use(express.json({ limit: '500mb' }));
    app.use(express.urlencoded({ limit: '500mb', extended: false }));

    const whitelist = [
        'http://localhost',
        'http://localhost:3000',
        'https://localhost',
        'https://localhost:3000',
        'http://34.64.100.12:3000',
        'http://34.64.238.165:3000',
        'http://34.64.247.62',
        'http://34.64.247.62:3000',
        'https://dub-ai.site',
        'https://dev.dub-ai.site',
        'http://34.64.211.37',
    ];
    var corsOptions = {
        origin: function (origin, callback) {
            console.log('@@@ ' + origin);
            if (whitelist.indexOf(origin) >= 0 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    };
    app.use(cors(corsOptions));

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
