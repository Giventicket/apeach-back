const mongoose = require('mongoose');
const chunkSchema = require('./chunk');

module.exports =
    process.env.NODE_ENV === 'production'
        ? mongoose.models.Chunk_v2 || mongoose.model('Chunk_v2', chunkSchema)
        : mongoose.models.Chunk_v2_dev ||
          mongoose.model('Chunk_v2_dev', chunkSchema);
