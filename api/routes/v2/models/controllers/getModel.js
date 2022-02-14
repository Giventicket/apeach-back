const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModel = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;

    if (user.models.length === 0) {
        const err = new Error(`Cannot find a model`);
        err.status = 404;
        throw err;
    }
    await user.populate('models').exec();

    const model = user.models[user.models.length - 1];

    res.status(200).json({
        message: `Find a model success`,
        data: model,
    });
});

module.exports = getModel;
