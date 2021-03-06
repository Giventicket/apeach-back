const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const updateUserAfterUploadAudio = asyncErrorWrapper(async (req, res, next) => {
    const { user, sample, waveUrl, samplesAudioCnt } = req;

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

    const date = new Date(Date.now());

    asyncSendWebhook(
        `sample audio 업로드 완료! [${samplesAudioCnt + 1}/145]`,
        date.toISOString(),
        user.email,
    );

    res.status(200).json({
        message: `Update a sample from user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
            models: updatedUser.models,
            agreed: user.agreed,
            sampleFinished: user.sampleFinished,
        },
    });
});

module.exports = updateUserAfterUploadAudio;
