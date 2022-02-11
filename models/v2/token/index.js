const mongoose = require('mongoose');
const tokenSchema = require('./token');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.models.Token_v2 || mongoose.model('Token_v2', tokenSchema)
        : mongoose.models.Token_v2_dev ||
          mongoose.model('Token_v2_dev', tokenSchema);
