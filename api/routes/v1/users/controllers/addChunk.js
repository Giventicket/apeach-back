const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const addChunk = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

    user.chunks.push(req.params.id);

    const newUser = await User.findOneAndUpdate(
        { _id: req.userId },
        { chunks: user.chunks },
        { new: true },
    ).exec();

    res.status(200).json({
        message: `Add chunk on user success`,
        data: newUser,
    });
});

module.exports = addChunk;
