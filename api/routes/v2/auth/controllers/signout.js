const User = require('../../../../../models/v2/user/index');
const Token = require('../../../../../models/v2/token/index');

const asyncBucketFileDelete = require('../../../../../utils/asyncBucketFileDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const signout = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({
        _id: req.user._id,
    })
        .populate('chunks')
        .exec();

    user.samples.forEach(sample => {
        asyncBucketFileDelete(sample.waveUrl);
    });

    user.chunks.forEach(chunk => {
        const audios = [chunk['sourceWaveUrl'], chunk['targetWaveUrl']];
        audios.forEach(audio => {
            asyncBucketFileDelete(audio);
        });
    });

    await User.deleteOne({ _id: user._id }).exec();

    asyncSendWebhook(
        `아쉽네요. __**${user.name}**__님이 탈퇴하셨습니다!`,
        user.createdAt,
        user.name,
    );

    res.cookie('refreshToken', '');
    await Token.deleteOne({ refreshToken: req.cookies.refreshToken }).exec();

    res.status(200).json({
        message: `Delete an user success`,
        data: {},
    });
});

module.exports = signout;
