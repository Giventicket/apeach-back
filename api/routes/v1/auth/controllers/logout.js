const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const jwt = require('jsonwebtoken');

const logout = asyncErrorWrapper(async (req, res, next) => {
    /*
    const tokenInfo = await new Promise((resolve, reject) => {
        jwt.verify(req.cookies.x_auth, 'secret', (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
    */
    console.log(tokenInfo);

    res.cookie('x_auth', '').json({
        message: `logout success`,
        data: {},
    });
});

module.exports = logout;
