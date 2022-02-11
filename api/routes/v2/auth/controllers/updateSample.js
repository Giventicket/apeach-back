const User = require('../../../../../models/v2/user/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateSample = asyncErrorWrapper(async (req, res, next) => {
    let { utteranceId, waveUrl } = req.body;

    const sample = req.user.samples.filter(
        sample => Number(utteranceId) === sample.utteranceId,
    )[0];

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    if (sample.waveUrl != null) asyncAudioDelete(sample.waveUrl);

    sample.waveUrl = waveUrl;

    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            samples: user.samples,
        },
        { new: true },
    )
        .populate('chunks')
        .exec();

    res.status(200).json({
        message: `Update a sample from user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
        },
    });
});

module.exports = updateSample;
