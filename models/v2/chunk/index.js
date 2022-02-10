const mongoose = require('mongoose');
const chunkSchema = require('./chunk');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.model('Chunk_v2', chunkSchema)
        : mongoose.model('Chunk_v2_dev', chunkSchema);
