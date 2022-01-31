const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.findOne({ _id: req.params.id }).exec();
    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        message: `Find a sample success`,
        data: sample,
    });
});

module.exports = getSample;
