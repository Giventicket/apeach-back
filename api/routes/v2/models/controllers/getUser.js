const User = require('../../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModel = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({
        name: req.params.speakerName,
    }).exec();

    if (user == null) {
        const err = new Error(`Cannot find a user`);
        err.status = 404;
        throw err;
    }

    req.user = user;
    next();
});

module.exports = getModel;
