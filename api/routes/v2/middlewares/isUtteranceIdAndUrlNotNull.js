const asyncErrorWrapper = require('../../../../utils/asyncErrorWrapper.js');

const isUtteranceIdAndUrlNotNull = asyncErrorWrapper(async (req, res, next) => {
    if (req.body.utteranceId == null || req.body.wave_url == null) {
        const err = new Error(
            `Request body(utteranceId, wave_url) is required!`,
        );
        err.status = 400;
        throw err;
    }
    next();
});

module.exports = isUtteranceIdAndUrlNotNull;
