const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getSample = asyncErrorWrapper(async (req, res, next) => {
    const user = await Sample.findOne({ _id: req.params.id }).exec();
    if (Sample == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        message: `Find success [find ${req.params.id}]`,
        data: user,
    });
});

module.exports = getSample;
