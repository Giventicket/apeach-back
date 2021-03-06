const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema(
    {
        refreshToken: {
            type: String,
            required: true,
        },
        userIp: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

module.exports = tokenSchema;
