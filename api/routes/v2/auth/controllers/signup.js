const User = require('../../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const signup = asyncErrorWrapper(async (req, res, next) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user) {
        const err = new Error(`Duplicate name ${name}`);
        err.status = 409;
        throw err;
    }
    await User.create({
        name,
        password,
    });
    res.status(201).json({
        message: `Create an user success`,
        data: {},
    });
});

module.exports = signup;