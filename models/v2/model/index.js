const mongoose = require('mongoose');
const modelSchema = require('./model');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.models.Model_v2 || mongoose.model('Model_v2', modelSchema)
        : mongoose.models.Model_v2_dev ||
          mongoose.model('Model_v2_dev', modelSchema);
