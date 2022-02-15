const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const chunkRef =
    process.env.NODE_ENV === 'production' ? 'Chunk_v2' : 'Chunk_v2_dev';
const modelRef =
    process.env.NODE_ENV === 'production' ? 'Model_v2' : 'Model_v2_dev';

const utteranceIds = [
    10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011,
    10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022,
    10023, 10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031, 10032, 10033,
    10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10042, 10043, 10044,
    10045, 10046, 10047, 10048, 10049, 10050, 10051, 10052, 10053, 10054, 10055,
    10056, 10057, 10058, 10059, 10060, 10061, 10062, 10063, 10064, 10065, 10066,
    10067, 10068, 10069, 10070, 20001, 20002, 20003, 20004, 20005, 20006, 20007,
    20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018,
    20019, 20020, 20021, 20022, 20023, 20024, 20025, 20026, 20027, 20028, 20029,
    20030, 20031, 20032, 20033, 20034, 20035, 20036, 20037, 20038, 20039, 20040,
    20041, 20042, 20043, 20044, 20045, 20046, 20047, 20048, 20049, 20050, 30001,
    30002, 30003, 30004, 30005, 30006, 30007, 30008, 30009, 30010, 30011, 30012,
    30013, 30014, 30015, 30016, 30017, 30018, 30019, 30020, 30021, 30022, 30023,
    30024, 30025,
];

const defaultSample = utteranceIds.map(utteranceId => ({ utteranceId }));

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
        email: {
            type: String,
            required: true,
        },
        samples: {
            type: [
                {
                    utteranceId: {
                        type: Number,
                        required: true,
                    },
                    waveUrl: {
                        type: String,
                        default: '',
                    },
                    _id: false,
                },
            ],
            default: defaultSample,
        },
        chunks: {
            type: [{ type: Schema.Types.ObjectId, ref: chunkRef }],
            default: [],
        },
        models: {
            type: [{ type: Schema.Types.ObjectId, ref: modelRef }],
            default: [],
        },
        samplesAudioCnt: {
            type: Number,
            default: 0,
        },
        chunksAudioCnt: {
            type: Number,
            default: 0,
        },
    },
    {
        versionKey: false,
    },
);

userSchema.set('timestamps', true);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
});

module.exports = userSchema;
