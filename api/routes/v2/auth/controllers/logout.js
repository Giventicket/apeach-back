const Token = require('../../../../../models/v2/token/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;

    await Token.deleteOne({ refreshToken: req.cookies.refreshToken }).exec();

    res.cookie('refreshToken', '');

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const date = new Date(Date.now());

    asyncSendWebhook(
        `${ip}에서 **${user.name}**님이 로그아웃하였습니다.`,
        date.toISOString(),
        user.email,
    );

    res.status(200).json({
        message: `logout success`,
        data: {},
    });
});

module.exports = logout;
