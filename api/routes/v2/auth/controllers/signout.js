const User = require('../../../../../models/v2/user/index');
const Token = require('../../../../../models/v2/token/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const signout = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({
        _id: req.user._id,
    })
        .populate('chunks')
        .populate('models')
        .exec();

    user.samples.forEach(sample => {
        asyncAudioDelete(sample.waveUrl);
    });

    user.models.forEach(model => {
        asyncAudioDelete(model.modelUrl);
    });

    user.chunks.forEach(chunk => {
        const audios = [chunk['sourceWaveUrl'], chunk['targetWaveUrl']];
        audios.forEach(audio => {
            asyncAudioDelete(audio);
        });
    });

    await User.deleteOne({ _id: user._id }).exec();

    res.cookie('refreshToken', '');
    await Token.deleteOne({ refreshToken: req.cookies.refreshToken }).exec();

    res.status(200).json({
        message: `Delete an user success`,
        data: {},
    });
});

module.exports = signout;
