const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id }).exec();

    if (user == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }

    await User.deleteOne({ _id: req.params.id }).exec();

    res.status(200).json({
        message: `Delete success [delete ${req.params.id}]`,
        data: {},
    });
});

module.exports = deleteUser;
