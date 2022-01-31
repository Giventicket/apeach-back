const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const chunkRef =
    process.env.NODE_ENV === 'production' ? 'Chunk_v1' : 'Chunk_v1_dev';
const sampleRef =
    process.env.NODE_ENV === 'production' ? 'Sample_v1' : 'Sample_v1_dev';
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        samples: {
            type: [{ type: Schema.Types.ObjectId, ref: sampleRef }],
            default: [],
        },
        chunks: {
            type: [{ type: Schema.Types.ObjectId, ref: chunkRef }],
            default: [],
        },
        qualified: {
            type: Boolean,
            default: false,
        },
        samplesAudioCnt: {
            type: Number,
            default: 0,
        },
        chunksAudioCnt: {
            type: Number,
            default: 0,
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
});

module.exports = userSchema;
