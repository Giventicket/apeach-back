const User = require('../../../../../models/v2/User/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateUserAfterDeleteChunk = asyncErrorWrapper(async (req, res, next) => {
    const { user, isAuthUser } = req;

    let updatedUser = null;

    if (isAuthUser)
        updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            {
                chunks: user.chunks.filter(id => id !== req.params.id),
                chunksAudioCnt: user.chunksAudioCnt - req.deletedAudioCnt,
            },
            { new: true },
        )
            .populate('chunks')
            .exec();

    res.status(201).json({
        message: `delete a chunk success`,
        data: isAuthUser
            ? {
                  name: updatedUser.name,
                  samples: updatedUser.samples,
                  chunks: updatedUser.chunks,
                  samplesAudioCnt: updatedUser.samplesAudioCnt,
                  chunksAudioCnt: updatedUser.chunksAudioCnt,
              }
            : {},
    });
});

module.exports = updateUserAfterDeleteChunk;
