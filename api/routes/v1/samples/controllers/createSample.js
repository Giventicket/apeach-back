const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const createSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.create({
        turn: req.body.turn,
        text: req.body.text,
    });
    res.status(201).json({
        message: `Create success[create ${sample._id}}]`,
        data: sample,
    });
});

module.exports = createSample;
