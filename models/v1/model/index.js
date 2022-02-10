const mongoose = require('mongoose');
const modelSchema = require('./model');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('Model_v1', modelSchema)
        : mongoose.model('Model_v1_dev', modelSchema);
