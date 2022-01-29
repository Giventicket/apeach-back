const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find({}).exec();
    res.status(200).json({
        message: 'Find success [find all]',
        data: users,
    });
});

module.exports = getUsers;
