const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const signup = asyncErrorWrapper(async (req, res, next) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user) {
        const err = new Error(`Duplicate name ${name}`);
        err.status = 409;
        throw err;
    }
    const newUser = await User.create({
        name,
        password,
    });

    asyncSendWebhook(
        `축하합니다. __**${newUser.name}**__님이 가입하셨습니다!`,
        newUser.createdAt,
        newUser.name,
    );

    res.status(201).json({
        message: `Create an user success`,
        data: {},
    });
});

module.exports = signup;
