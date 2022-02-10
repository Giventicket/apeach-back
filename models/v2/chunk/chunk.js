const mongoose = require('mongoose');

const { Schema } = mongoose;
const chunkSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        speakerId: {
            type: String,
            required: true,
        },
        sourceWaveUrl: {
            type: String,
            default: '',
        },
        targetWaveUrl: {
            type: String,
            default: '',
        },
        segments: [
            {
                startTime: {
                    type: Number,
                    default: 0,
                },
                endTime: {
                    type: Number,
                    default: 0,
                },
                sourceText: {
                    type: String,
                    default: '',
                },
                targetText: {
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
