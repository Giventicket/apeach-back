const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const signout = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;
    await User.deleteOne({ _id: req.userId }).exec();

    user.samples.forEach(sample => {
        asyncAudioDelete(sample.wave_url);
    });

    user.chunks.forEach(chunk => {
        const audios = [chunk['source_wave_url'], chunk['target_wave_url']];
        audios.forEach(audio => {
            asyncAudioDelete(audio);
        });
    });

    res.status(200).json({
        message: `Delete success [delete ${req.userId}]`,
        data: {},
    });
});

module.exports = signout;
