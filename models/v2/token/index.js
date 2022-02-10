const mongoose = require('mongoose');
const tokenSchema = require('./token');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('Token_v2', tokenSchema)
        : mongoose.model('Token_v2_dev', tokenSchema);
