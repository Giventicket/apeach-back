const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const deleteSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.findOne({ _id: req.params.id }).exec();

    if (sample == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }

    await Sample.deleteOne({ _id: req.params.id }).exec();

    res.status(200).json({
        message: `Delete success [delete ${req.params.id}]`,
        data: {},
    });
});

module.exports = deleteSample;
