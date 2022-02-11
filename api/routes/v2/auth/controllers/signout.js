const User = require('../../../../../models/v2/user/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const signout = asyncErrorWrapper(async (req, res, next) => {
    const { user, userId } = req;
    await User.deleteOne({ _id: userId }).exec();

    user.samples.forEach(sample => {
        asyncAudioDelete(sample.waveUrl);
    });

    user.chunks.forEach(chunk => {
        const audios = [chunk['sourceWaveUrl'], chunk['targetWaveUrl']];
        audios.forEach(audio => {
            asyncAudioDelete(audio);
        });
    });

    res.status(200).json({
        message: `Delete an user success`,
        data: {},
    });
});

module.exports = signout;
