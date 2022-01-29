const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const login = asyncErrorWrapper(async (req, res, next) => {
    let user = await User.findOne({
        name: req.body.name,
    });

    if (!user) {
        const err = new Error(`Login failed [Cannot find ${req.body.name}]`);
        err.status = 404;
        throw err;
    }

    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
    );

    if (!passwordIsValid) {
        const err = new Error(`Login failed [Invalid password]`);
        err.status = 401;
        throw err;
    }

    const token = jwt.sign({ id: user._id }, 'secret', {
        expiresIn: 86400,
    });

    user._id = undefined;
    user.password = undefined;

    res.status(200).json({
        message: `login success`,
        data: {
            user,
            accessToken: token,
        },
    });
});

module.exports = login;
