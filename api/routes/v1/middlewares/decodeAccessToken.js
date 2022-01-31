const User = require('../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');
const jwt = require('jsonwebtoken');

const decodeAccessToken = asyncErrorWrapper(async (req, res, next) => {
    const userId = await new Promise(async (resolve, reject) => {
        jwt.verify(req.body.accessToken, 'secret', (err, decoded) => {
            if (err) {
                err.status = 401;
                reject(err);
            } else {
                resolve(decoded.id);
            }
        });
    });

    const user = await User.findOne({ _id: userId }).exec();

    if (user == null) {
        const err = new Error(`Cannot find a chunk`);
        err.status = 404;
        throw err;
    }

    req.user = user;
    req.userId = userId;

    next();
});

module.exports = decodeAccessToken;
