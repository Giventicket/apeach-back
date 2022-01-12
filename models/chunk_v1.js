const mongoose = require('mongoose');

const { Schema } = mongoose;
const chunkSchema = new Schema({
    status: {
        type: String, // 0 : source_wave, 1 : source_text, 2 : target_text, 3 : target_wave
        default: "0",
    }, 
    source_wave_url: {
        type: String,
        default: ""
    },
    source_wave_name: {
        type: String,
        default: ""
    },
    target_wave_url: {
        type: String,
        default: ""
    },
    target_wave_name: {
        type: String,
        default: ""
    },
    segments: [{
        start_time: {
            type: String,
            default: ""
        },
        end_time: {
            type: String,
            default: ""
        },
        source_text: {
            type: String,
            default: ""
        },
        target_text: {
            type: String,
            default: ""
        },
        _id: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chunk_v1', chunkSchema);