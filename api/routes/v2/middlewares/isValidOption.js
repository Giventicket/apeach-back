const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');

const isValidOption = asyncErrorWrapper(async (req, res, next) => {
    if (req.params.option === 'short' || req.params.option === 'long') {
        next();
    } else {
        const err = new Error(
            `only short and long is valid for option parameters`,
        );
        err.status = 400;
        throw err;
    }
});

module.exports = isValidOption;
