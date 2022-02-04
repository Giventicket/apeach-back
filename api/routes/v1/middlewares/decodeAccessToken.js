const User = require('../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');
const jwt = require('jsonwebtoken');

const decodeAccessToken = asyncErrorWrapper(async (req, res, next) => {
    if (req.headers.authorization == null) {
        req.isAuthUser = false;
        return next();
    }

    const userId = await new Promise(async (resolve, reject) => {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            'secret',
            (err, decoded) => {
                if (err.name === 'TokenExpiredError') {
                    err.status = 401;
                    reject(err);
                } else {
                    resolve(decoded.id);
                }
            },
        );
    });

    const user = await User.findOne({
        _id: userId,
    }).exec();

    if (user == null) {
        const err = new Error(`Cannot find a user`);
        err.status = 404;
        throw err;
    }

    req.user = user;
    req.userId = userId;
    req.isAuthUser = true;
    next();
});

module.exports = decodeAccessToken;
