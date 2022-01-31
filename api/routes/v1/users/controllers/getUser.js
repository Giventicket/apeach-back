const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id })
        .populate('samples')
        .populate('chunks')
        .exec();
    if (user == null) {
        const err = new Error(`Cannot find an user`);
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        message: `Find an user success`,
        data: user,
    });
});

module.exports = getUser;
