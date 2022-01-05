const mongoose = require('mongoose');

module.exports = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_HOST}:${process.env.MONGODB_PASSWORD}@apeach-data.jrqlj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        dbName: 'myFirstDatabase',
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (error) => {
        if (error)
            console.log('mongoDB 연결 에러', error);
        else 
            console.log('mongoDB 연결 성공!');
    });
};

mongoose.connection.on('error', (error) => {
    console.error('mongoDB connection error', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('mongoDB 끊김... 다시 접속중...');
    connect();
});