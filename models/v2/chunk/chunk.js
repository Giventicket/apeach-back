const mongoose = require('mongoose');

const { Schema } = mongoose;
const chunkSchema = new Schema(
    {
        duration: {
            type: Number,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        speakerName: {
            type: String,
            default: 'will.hajh@kakaobrain.com',
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
    },
    {
        versionKey: false,
    },
);

chunkSchema.set('timestamps', true);

module.exports = chunkSchema;
