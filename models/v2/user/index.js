const mongoose = require('mongoose');
const userSchema = require('./user');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('User_v2', userSchema)
        : mongoose.model('User_v2_dev', userSchema);
