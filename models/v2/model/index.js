const mongoose = require('mongoose');
const modelSchema = require('./model');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('Model_v2', modelSchema)
        : mongoose.model('Model_v2_dev', modelSchema);
