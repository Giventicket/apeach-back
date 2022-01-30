const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id }).exec();

    if (user == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }

    user.samples.forEach(sample => {
        asyncAudioDelete(sample.wave_url);
    });

    user.chunks.forEach(chunk => {
        const audios = [chunk['source_wave_url'], chunk['target_wave_url']];
        audios.forEach(audio => {
            asyncAudioDelete(audio);
        });
    });

    await User.deleteOne({ _id: req.params.id }).exec();

    res.status(200).json({
        message: `Delete success [delete ${req.params.id}]`,
        data: {},
    });
});

module.exports = deleteUser;
