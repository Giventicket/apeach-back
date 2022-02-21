const User = require('../../../../../models/v2/user/index');
const Model = require('../../../../../models/v2/model/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModels = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;
    const users = await User.find({}).exec();
    const filteredUsers = users.filter(
        u => (u.models.length !== 0 && u.agreed) || u.name === user.name,
    );

    let models = [];

    for (const user of filteredUsers) {
        const model = await Model.findOne({
            _id: user.models[user.models.length - 1],
        }).exec();
        models.push(model);
    }

    res.status(200).json({
        message: `Find models success`,
        data: models,
    });
});

module.exports = getModels;
