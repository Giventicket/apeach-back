const mongoose = require('mongoose');
const userSchema = require('./user');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('User_v1', userSchema)
        : mongoose.model('User_v1_dev', userSchema);
