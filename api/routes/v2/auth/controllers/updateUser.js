const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhookForSampleFinished = require('../../../../../utils/asyncSendWebhookForSampleFinished');

const updateUser = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;
    console.log(req.params.agreed);
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

    asyncSendWebhookForSampleFinished(
        `**주목!!**\n${
            updatedUser.name
        } 님은 모든 sample audio 업로드 완료하였습니다!\n목소리 공개의 동의 여부: __**${
            updatedUser.agreed ? '동의' : '비동의'
        }**__`,
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
            agreed: updatedUser.agreed,
            sampleFinished: updatedUser.sampleFinished,
        },
    });
});

module.exports = updateUser;
