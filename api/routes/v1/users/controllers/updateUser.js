const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
            name: req.body.name,
            samples: req.body.samples,
            chunks: req.body.chunks,
        },
        { new: true },
    ).exec();

    if (user == null) {
        const err = new Error(`Cannot find an user`);
        err.status = 404;
        throw err;
    }

    res.status(200).json({
        message: `update an user success`,
        data: user,
    });
});

module.exports = updateUser;
