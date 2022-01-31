const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const createSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.create({
        text: req.body.text,
        turn: req.body.turn,
        wave_url: req.body.wave_url,
    });
    res.status(201).json({
        message: `Create a sample success`,
        data: sample,
    });
});

module.exports = createSample;
