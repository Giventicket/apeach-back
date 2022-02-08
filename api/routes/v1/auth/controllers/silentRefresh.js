const Token = require('../../../../../models/v1/token/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const silentRefresh = asyncErrorWrapper(async (req, res, next) => {
    const { refreshToken, userId, userIp } = await Token.findOne({
        refreshToken: req.cookies.refreshToken,
    }).exec();

    if (refreshToken == null) {
        const err = new Error(`Cannot find refreshToken from DB`);
        err.status = 401;
        throw err;
    }

    await new Promise(async (resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err.name === 'TokenExpiredError') {
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
        expiresIn: '30s',
    });

    res.status(200).json({
        message: `Create an user success`,
        data: { accessToken },
    });
});

module.exports = silentRefresh;
