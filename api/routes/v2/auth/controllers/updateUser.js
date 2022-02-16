const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const updateUser = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;

    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            agreed: req.params.agreed === 'true',
            sampleFinished: true,
        },
        { new: true },
    )
        .populate('chunks')
        .exec();

    asyncSendWebhook(
        `**주목!!**\n${updatedUser.name} 님은 모든 sample audio 업로드 완료하였습니다!\nagreed:${updatedUser.agreed}`,
        updatedUser.updatedAt,
        updatedUser.email,
    );

    res.status(200).json({
        message: `Update an user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
            agreed: user.agreed,
            sampleFinished: user.sampleFinished,
        },
    });
});

module.exports = updateUser;
