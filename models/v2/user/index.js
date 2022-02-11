const mongoose = require('mongoose');
const userSchema = require('./user');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.models.User_v2 || mongoose.model('User_v2', userSchema)
        : mongoose.models.User_v2_dev ||
          mongoose.model('User_v2_dev', userSchema);
