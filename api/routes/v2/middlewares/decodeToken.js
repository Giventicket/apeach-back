const Token = require('../../../../models/v2/token/index');
const User = require('../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');
const jwt = require('jsonwebtoken');

const decodeToken = asyncErrorWrapper(async (req, res, next) => {
    const accessToken = req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : null;

    // Case 1: refreshToken X accessToken X
    if (req.cookies.refreshToken == null || accessToken == null) {
        console.log('unauthorized user decoded');
        req.isAuthUser = false;
        return next();
    }

    const { refreshToken, userId, userIp } = await Token.findOne({
        refreshToken: req.cookies.refreshToken,
    }).exec();

    // Case 2: DB에 refreshToken X
    if (refreshToken == null) {
        const err = new Error(`Cannot find refreshToken from DB`);
        err.status = 401;
        throw err;
    }

    await new Promise(async (resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                // Case 3: refreshToken 만료
                err.status = 401;
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Case 4-1: 클라이언트가 전송한 req의 refreshToken의 ip와 request의 header에서 뽑아낸 ip가 다름. request.refreshToken.ip ≠ request.header.ip
    if (ip !== userIp) {
        const err = new Error(`Ip address conflict`);
        err.status = 401;
        throw err;
    }

    //Case 4-2: 클라이언트가 전송한 req의 refreshToken의 ip와 request의 header에서 뽑아낸 ip가 같음. request.refreshToken.ip == request.header.ip
    const decodedAccessToken = await new Promise(async (resolve, reject) => {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                err.status = 401;
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });

    const user = await User.findOne({
        _id: decodedAccessToken.id,
    }).exec();

    if (user == null) {
        const err = new Error(`Cannot find a user`);
        err.status = 404;
        throw err;
    }

    req.user = user;
    req.isAuthUser = true;
    console.log('authorized user decoded');
    next();
});

module.exports = decodeToken;
