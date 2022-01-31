const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.findOneAndUpdate(
        { _id: req.params.id },
        {
            text: req.body.text,
            wave_url: req.body.wave_url,
        },
        { new: true },
    ).exec();

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    res.status(200).json({
        message: `update a sample success`,
        data: sample,
    });
});

module.exports = updateSample;
