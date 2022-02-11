const Token = require('../../../../../models/v2/token/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const logout = asyncErrorWrapper(async (req, res, next) => {
    await Token.deleteOne({ refreshToken: req.cookies.refreshToken }).exec();

    res.cookie('refreshToken', '');

    res.status(200).json({
        message: `logout success`,
        data: {},
    });
});

module.exports = logout;
