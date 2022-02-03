const User = require('../../../../../models/v1/user/index');
const Chunk = require('../../../../../models/v1/chunk/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const removeChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({ _id: req.params.id }).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find a chunk`);
        err.status = 404;
        throw err;
    }

    await Chunk.deleteOne({ _id: req.params.id }).exec();

    const audios = [chunk['source_wave_url'], chunk['target_wave_url']];

    audios.forEach(audio => {
        asyncAudioDelete(audio);
    });

    console.log(
        req.user.chunks.filter(id => {
            return id !== req.params.id;
        }),
    );
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
            chunks: req.user.chunks.filter(id => {
                return String(id) !== req.params.id;
            }),
            chunksAudioCnt: req.user.chunksAudioCnt - 2,
        },
        { new: true },
    )
        .populate('samples')
        .populate('chunks')
        .exec();

    res.status(200).json({
        message: `Remove a chunk from user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
        },
    });
});

module.exports = removeChunk;
