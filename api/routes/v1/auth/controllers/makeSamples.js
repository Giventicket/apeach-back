const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const makeSamples = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.create({
        text: req.body.text,
        turn: req.body.turn,
    });
    res.status(201).json({
        message: `Add samples on user success`,
        data: sample,
    });
});

module.exports = makeSamples;
