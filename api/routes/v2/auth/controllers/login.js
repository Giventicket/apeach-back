const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../../../../models/v2/user/index');
const Token = require('../../../../../models/v2/token/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const login = asyncErrorWrapper(async (req, res, next) => {
    let user = await User.findOne({
        name: req.body.name,
    })
        .populate('chunks')
        .exec();

    if (user == null) {
        const err = new Error(`Login failed [Cannot find ${req.body.name}]`);
        err.status = 404;
        throw err;
    }

    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
    );

    if (!passwordIsValid) {
        const err = new Error(`Login failed [Invalid password]`);
        err.status = 401;
        throw err;
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
        expiresIn: '3h',
        issuer: 'dubai',
    });

    await Token.create({
        refreshToken,
        userIp: ip,
        userId: user._id,
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30m',
    });

    res.cookie('refreshToken', refreshToken, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
    });

    const date = new Date(Date.now());

    asyncSendWebhook(
        `${ip}에서 **${user.name}**님이 로그인 했습니다.`,
        date.toISOString(),
        user.email,
    );

    res.status(200).json({
        message: `login success`,
        data: {
            name: user.name,
            email: user.email,
            samples: user.samples,
            chunks: user.chunks,
            models: user.models,
            samplesAudioCnt: user.samplesAudioCnt,
            chunksAudioCnt: user.chunksAudioCnt,
            agreed: user.agreed,
            sampleFinished: user.sampleFinished,
            accessToken,
        },
    });
});

module.exports = login;
