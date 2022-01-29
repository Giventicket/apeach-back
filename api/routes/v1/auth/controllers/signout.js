const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const signout = asyncErrorWrapper(async (req, res, next) => {
    await User.deleteOne({ _id: req.params.id }).exec();

    res.status(200).json({
        message: `Delete success [delete ${req.params.id}]`,
        data: {},
    });
});

module.exports = signout;
