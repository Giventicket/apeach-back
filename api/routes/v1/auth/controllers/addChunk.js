const User = require('../../../../../models/v1/user/index');
const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const addChunk = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

    const chunk = await Chunk.findOne({ _id: req.params.id }).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find a chunk`);
        err.status = 404;
        throw err;
    }

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
        message: `Add a chunk on user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
        },
    });
});

module.exports = addChunk;
