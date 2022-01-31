const User = require('../../../../../models/v1/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');

const deleteUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find({}).exec();

    users.forEach(user => {
        user.samples.forEach(sample => {
            asyncAudioDelete(sample.wave_url);
        });

        user.chunks.forEach(chunk => {
            const audios = [chunk['source_wave_url'], chunk['target_wave_url']];
            audios.forEach(audio => {
                asyncAudioDelete(audio);
            });
        });
    });

    await User.deleteMany({}).exec();

    res.status(200).json({
        message: 'Delete users success',
        data: {},
    });
});

module.exports = deleteUsers;
