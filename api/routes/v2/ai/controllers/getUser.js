const User = require('../../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getUser = asyncErrorWrapper(async (req, res, next) => {
    const { chunk } = req;
    if (chunk.userName === 'anonymous') {
        req.isAuthUser = false;
        next();
    } else {
        const user = await User.findOne({ name: chunk.userName }).exec();

        if (user == null) {
            const err = new Error(`Cannot find a user`);
            err.status = 404;
            throw err;
        }

        req.user = user;
        req.isAuthUser = true;

        next();
    }
});

module.exports = getUser;
