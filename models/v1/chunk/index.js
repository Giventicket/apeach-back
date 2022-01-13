const mongoose = require('mongoose');
const chunkSchema = require('./chunk');

module.exports = process.env.NODE_ENV === 'production' ? mongoose.model('Chunk_v1', chunkSchema) : mongoose.model('Chunk_v1_dev', chunkSchema);