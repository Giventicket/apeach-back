const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const createUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
    });
    res.status(201).json({
        message: `Create success[create ${user._id}}]`,
        data: user,
    });
});

module.exports = createUser;
