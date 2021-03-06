const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const signup = asyncErrorWrapper(async (req, res, next) => {
    const { name, password, email } = req.body;

    let user = null;
    user = await User.findOne({ name });

    if (user) {
        const err = new Error(`Duplicate name ${name}`);
        err.status = 409;
        throw err;
    }

    user = await User.findOne({ email });

    if (user) {
        const err = new Error(`Duplicate email ${email}`);
        err.status = 409;
        throw err;
    }

    const newUser = await User.create({
        name,
        password,
        email,
    });

    asyncSendWebhook(
        `축하합니다. __**${newUser.name}**__님이 가입하셨습니다!`,
        newUser.createdAt,
        newUser.email,
    );

    res.status(201).json({
        message: `Create an user success`,
        data: {},
    });
});

module.exports = signup;
