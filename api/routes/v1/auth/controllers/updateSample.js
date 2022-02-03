const User = require('../../../../../models/v1/user/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateSample = asyncErrorWrapper(async (req, res, next) => {
    let { utteranceId, wave_url } = req.body;

    const sample = req.user.samples.filter(
        sample => Number(utteranceId) === sample.utteranceId,
    )[0];

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    if (sample.wave_url != null) asyncAudioDelete(sample.wave_url);

    sample.wave_url = wave_url;

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
            samples: req.user.samples,
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
