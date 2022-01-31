const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const addChunk = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

    user.chunks.push(req.params.id);

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        { chunks: user.chunks },
        { new: true },
    )
        .populate('samples')
        .populate('chunks')
        .exec();

    res.status(200).json({
        message: `Add chunk on user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            qualified: updatedUser.qualified,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
        },
    });
});

module.exports = addChunk;
