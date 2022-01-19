const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
const connect = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
    };

    await mongoose.connect(uri, mongooseOpts);
};

const closeDatabase = async () => {
    await mongoose.disconnect();
    await mongod.stop();
};

module.exports = { connect, closeDatabase };
