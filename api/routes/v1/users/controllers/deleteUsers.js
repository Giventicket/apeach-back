const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const deleteUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find({}).exec();
    await User.deleteMany({}).exec();

    res.status(200).json({
        message: 'Delete success [delete all]',
        data: {},
    });
});

module.exports = deleteUsers;
