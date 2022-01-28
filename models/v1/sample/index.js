const mongoose = require('mongoose');

const sampleSchema = require('./sample');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('Sample_v1', sampleSchema)
        : mongoose.model('Sample_v1_dev', sampleSchema);
