const User = require('../../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateUserAfterUploadAudio = asyncErrorWrapper(async (req, res, next) => {
    const { user, sample, waveUrl, samplesAudioCnt } = req;
    console.log('updateUserAfterUploadAudio ', samplesAudioCnt, waveUrl);

    sample.waveUrl = waveUrl;

    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            samples: user.samples,
            samplesAudioCnt: samplesAudioCnt + 1,
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

module.exports = updateUserAfterUploadAudio;
