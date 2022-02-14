const Model = require('../../../../../models/v2/model/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModel = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;

    if (user.models.length === 0) {
        const err = new Error(`Cannot find a model`);
        err.status = 404;
        throw err;
    }

    const model = await Model.findOne({
        _id: user.models[user.models.length - 1],
    }).exec();

    res.status(200).json({
        message: `Find a model success`,
        data: model,
    });
});

module.exports = getModel;
