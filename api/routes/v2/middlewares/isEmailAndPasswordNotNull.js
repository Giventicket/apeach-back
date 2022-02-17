const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');

const isEmailAndPasswordNotNull = asyncErrorWrapper(async (req, res, next) => {
    if (req.body.email == null || req.body.password == null) {
        const err = new Error(`Request body(name, password) is required!`);
        err.status = 400;
        throw err;
    }
    next();
});

module.exports = isEmailAndPasswordNotNull;
