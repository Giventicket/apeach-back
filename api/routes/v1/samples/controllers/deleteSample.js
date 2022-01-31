const Sample = require('../../../../../models/v1/sample/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');

const deleteSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.findOne({ _id: req.params.id }).exec();

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    asyncAudioDelete(sample.wave_url);

    await Sample.deleteOne({ _id: req.params.id }).exec();

    res.status(200).json({
        message: `Delete a sample success`,
        data: {},
    });
});

module.exports = deleteSample;
