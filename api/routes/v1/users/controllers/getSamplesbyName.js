const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getSamplesbyName = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ name: req.params.name })
        .populate('samples')
        .exec();

    if (user == null) {
        const err = new Error(`Cannot find an user`);
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        message: `Find samples success`,
        data: user.samples,
    });
});

module.exports = getSamplesbyName;
