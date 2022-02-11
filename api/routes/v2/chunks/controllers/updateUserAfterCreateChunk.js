const User = require('../../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateUserAfterCreateChunk = asyncErrorWrapper(async (req, res, next) => {
    const { user, isAuthUser, chunk } = req;

    if (isAuthUser) {
        user.chunks.push(chunk._id);
        await User.updateOne(
            { _id: user._id },
            {
                chunks: user.chunks,
                chunksAudioCnt: user.chunksAudioCnt + 1,
            },
        ).exec();
    }

    res.status(201).json({
        message: `Create a chunk success`,
        data: chunk,
    });
});

module.exports = updateUserAfterCreateChunk;
