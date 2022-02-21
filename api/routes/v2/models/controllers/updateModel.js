const User = require('../../../../../models/v2/user/index');
const Model = require('../../../../../models/v2/model/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateModel = asyncErrorWrapper(async (req, res, next) => {
    const { sampleSentenceUrl } = req;
    const user = await User.findOne({ name: req.params.speakerName }).exec();

    const modelId = user.models[user.models.length - 1];

    const model = await Model.findOneAndUpdate(
        { _id: modelId },
        {
            sampleSentenceUrl,
        },
        { new: true },
    ).exec();

    res.status(200).json({
        message: `Update a model success`,
        data: model,
    });
});

module.exports = updateModel;
