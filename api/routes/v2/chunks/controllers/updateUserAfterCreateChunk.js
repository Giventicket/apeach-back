const User = require('../../../../../models/v2/User/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateUserAfterCreateChunk = asyncErrorWrapper(async (req, res, next) => {
    const { user, isAuthUser, chunk } = req;

    if (isAuthUser)
        await User.updateOne(
            { _id: user._id },
            {
                chunks: user.chunks.push(chunk._id),
                chunksAudioCnt: user.chunkAudioCnt + 1,
            },
        ).exec();

    res.status(201).json({
        message: `Create a chunk success`,
        data: chunk,
    });
});

module.exports = updateUserAfterCreateChunk;
