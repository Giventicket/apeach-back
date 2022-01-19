const mongoose = require('mongoose');

const { Schema } = mongoose;
const chunkSchema = new Schema(
    {
        status: {
            type: String, // 0 : source_wave, 1 : source_text, 2 : target_text, 3 : target_wave
            default: '0',
        },
        source_wave_url: {
            type: String,
            default: '',
        },
        target_wave_url: {
            type: String,
            default: '',
        },
        segments: [
            {
                start_time: {
                    type: Number,
                    default: 0,
                },
                end_time: {
                    type: Number,
                    default: 0,
                },
                source_text: {
                    type: String,
                    default: '',
                },
                target_text: {
                    type: String,
                    default: '',
                },
                _id: false,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    },
);

module.exports = chunkSchema;
