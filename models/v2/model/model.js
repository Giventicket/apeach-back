const mongoose = require('mongoose');
const { Schema } = mongoose;

const modelSchema = new Schema(
    {
        speakerName: {
            type: String,
            required: true,
        },
        modelUrl: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

modelSchema.set('timestamps', true);

module.exports = modelSchema;
