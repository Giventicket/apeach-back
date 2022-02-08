const mongoose = require('mongoose');
const tokenSchema = require('./token');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('Token_v1', tokenSchema)
        : mongoose.model('Token_v1_dev', tokenSchema);
