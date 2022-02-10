const mongoose = require('mongoose');
const { Schema } = mongoose;

const modelSchema = new Schema(
    {
        speakerId: {
            type: String,
            required: true,
        },
        model_url: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

module.exports = modelSchema;
