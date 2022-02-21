const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateAgreed = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            agreed: req.params.agreed === 'true',
        },
        { new: true },
    ).exec();

    res.status(200).json({
        message: `Update an user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
            agreed: updatedUser.agreed,
            sampleFinished: updatedUser.sampleFinished,
        },
    });
});

module.exports = updateAgreed;
