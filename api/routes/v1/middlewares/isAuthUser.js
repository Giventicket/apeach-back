const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');
const jwt = require('jsonwebtoken');

const isAuthUser = asyncErrorWrapper(async (req, res, next) => {
    if (!req.isAuthUser) {
        const err = new Error(`Not an authorized user`);
        err.status = 401;
        throw err;
    }
    next();
});

module.exports = isAuthUser;
