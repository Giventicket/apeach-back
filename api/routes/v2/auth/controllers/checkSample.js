const User = require('../../../../../models/v2/user/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const checkSample = asyncErrorWrapper(async (req, res, next) => {
    const { utteranceId } = req.params;
    const { user } = req;

    const sample = user.samples.filter(
        sample => Number(utteranceId) === sample.utteranceId,
    )[0];

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    req.sample = sample;
    req.samplesAudioCnt = user.samplesAudioCnt;

    if (sample.waveUrl !== '') {
        asyncAudioDelete(sample.waveUrl);
        req.samplesAudioCnt--;
    }

    next();
});

module.exports = checkSample;
