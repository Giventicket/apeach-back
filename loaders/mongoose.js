const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = () => {
    if (process.env.NODE_ENV == 'dev') {
        mongoose.set(
            'debug',
            function (collectionName, method, query, doc, options) {
                logger.info(
                    `mongo collection: ${collectionName}, method: ${method}, query: ${JSON.stringify(
                        query,
                    )}`,
                );
            },
        );
    }

    mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_HOST}:${process.env.MONGODB_PASSWORD}@apeach-data.jrqlj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            dbName: 'myFirstDatabase',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        error => {
            if (error) console.log('mongoDB 연결 에러', error);
            else console.log('mongoDB 연결 성공!');
        },
    );

    mongoose.connection.on('error', error => {
        console.error('mongoDB connection error', error);
    });

    mongoose.connection.on('disconnected', () => {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        console.error('mongoDB 끊김... 다시 접속중...');
        connect();
    });
};
