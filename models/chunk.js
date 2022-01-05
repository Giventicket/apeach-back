const mongoose = require('mongoose');

const { Schema } = mongoose;
const chunkSchema = new Schema({
    status: {
        type: String, // 0 : source_wave, 1 : source_text, 2 : target_text, 3 : target_wave
    }, 
    source_wave_url: {
        type: String
    }, 
    source_text: {
        type: String
    }, 
    target_text: {
        type: String
    }, 
    target_wave_url: {
        type: String
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chunk', chunkSchema);