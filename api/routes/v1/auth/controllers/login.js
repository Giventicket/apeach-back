const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const login = asyncErrorWrapper(async (req, res, next) => {
    let user = await User.findOne({
        name: req.body.name,
    })
        .populate('chunks')
        .exec();

    if (!user) {
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
        expiresIn: '1d',
        issuer: ip,
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
        issuer: ip,
    });

    res.status(200).json({
        message: `login success`,
        data: {
            name: user.name,
            samples: user.samples,
            chunks: user.chunks,
            samplesAudioCnt: user.samplesAudioCnt,
            chunksAudioCnt: user.chunksAudioCnt,
        },
    });
});

module.exports = login;
