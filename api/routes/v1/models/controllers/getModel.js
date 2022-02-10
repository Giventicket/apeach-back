const Model = require('../../../../../models/v1/model/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModel = asyncErrorWrapper(async (req, res, next) => {
    const model = await Model.findOne({ _id: req.params.id }).exec();
    if (model == null) {
        const err = new Error(`Cannot find a model`);
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        message: `Find a model success`,
        data: model,
    });
});

module.exports = getModel;
