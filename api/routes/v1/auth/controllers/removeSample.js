const User = require('../../../../../models/v1/user/index');
const Sample = require('../../../../../models/v1/sample/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const removeSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.findOne({ _id: req.params.id }).exec();

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    await Sample.deleteOne({ _id: req.params.id }).exec();

    asyncAudioDelete(sample.wave_url);

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
            samples: req.user.samples.filter(id => {
                return id !== req.params.id;
            }),
            samplesAudioCnt: req.user.samplesAudioCnt - 1,
        },
        { new: true },
    )
        .populate('samples')
        .populate('chunks')
        .exec();

    res.status(200).json({
        message: `Remove a sample from user success`,
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

module.exports = removeSample;
