const Model = require('../../../../../models/v2/model/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModels = asyncErrorWrapper(async (req, res, next) => {
    const models = await Model.find({}).exec();
    res.status(200).json({
        message: `Find models success`,
        data: models,
    });
});

module.exports = getModels;
