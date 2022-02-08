const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const signup = asyncErrorWrapper(async (req, res, next) => {
    const { name, password, qualified } = req.body;
    const user = await User.findOne({ name });
    if (user) {
        const err = new Error(`Duplicate name ${name}`);
        err.status = 404;
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