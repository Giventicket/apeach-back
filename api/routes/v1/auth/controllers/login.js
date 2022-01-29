const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const login = asyncErrorWrapper(async (req, res, next) => {
    let user = await User.findOne({
        name: req.body.name,
    }).exec();

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
        expiresIn: '7d',
    });

    res.status(200)
        .cookie('x_auth', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
            httpOnly: true,
        })
        .json({
            message: `login success`,
            data: {
                name: user.name,
                samples: user.samples,
                chunks: user.chunks,
                qualified: user.qualified,
                completed: user.completed,
                accessToken: token,
            },
        });
});

module.exports = login;
