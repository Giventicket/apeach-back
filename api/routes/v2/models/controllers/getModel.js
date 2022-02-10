const Model = require('../../../../../models/v2/model/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModel = asyncErrorWrapper(async (req, res, next) => {
    const model = await Model.findOne({
        speakerName: req.params.speakerName,
    }).exec();

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
