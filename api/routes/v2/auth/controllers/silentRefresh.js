const jwt = require('jsonwebtoken');

const User = require('../../../../../models/v2/user/index');
const Token = require('../../../../../models/v2/token/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const silentRefresh = asyncErrorWrapper(async (req, res, next) => {
    const { refreshToken, userIp, userId } = await Token.findOne({
        refreshToken: req.cookies.refreshToken,
    }).exec();

    if (refreshToken == null) {
        const err = new Error(`Cannot find refreshToken from DB`);
        err.status = 401;
        throw err;
    }

    await new Promise(async (resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                err.status = 401;
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (ip !== userIp) {
        const err = new Error(`Ip address conflict`);
        err.status = 401;
        throw err;
    }

    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30m',
    });

    const user = await User.findOne({
        _id: userId,
    }).exec();

    res.status(200).json({
        message: `refresh success`,
        data: {
            name: user.name,
            email: user.email,
            samples: user.samples,
            chunks: user.chunks,
            models: user.models,
            samplesAudioCnt: user.samplesAudioCnt,
            chunksAudioCnt: user.chunksAudioCnt,
            accessToken,
        },
    });
});

module.exports = silentRefresh;
