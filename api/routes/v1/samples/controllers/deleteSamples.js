const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');

const deleteSamples = asyncErrorWrapper(async (req, res, next) => {
    const samples = await Sample.find({});

    samples.forEach(sample => {
        asyncAudioDelete(sample.wave_url);
    });

    await Sample.deleteMany({}).exec();

    res.status(200).json({
        message: 'Delete success [delete all]',
        data: {},
    });
});

module.exports = deleteSamples;
