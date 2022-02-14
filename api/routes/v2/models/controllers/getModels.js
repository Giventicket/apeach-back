const User = require('../../../../../models/v2/user/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getModels = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.findOne({}).exec();
    const filteredUsers = users.filter(user => user.models.length !== 0);

    let models = [];
    for (const user of filteredUsers) {
        await user.populate('models').exec();
        models.push(user.models[user.models.length - 1]);
    }

    res.status(200).json({
        message: `Find models success`,
        data: models,
    });
});

module.exports = getModels;
