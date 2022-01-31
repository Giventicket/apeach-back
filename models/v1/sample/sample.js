const mongoose = require('mongoose');

const { Schema } = mongoose;
const sampleSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        wave_url: {
            type: String,
            required: true,
        },
        turn: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    },
);

module.exports = sampleSchema;
