const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getSamples = asyncErrorWrapper(async (req, res, next) => {
    const samples = await Sample.find({}).exec();
    res.status(200).json({
        message: 'Find samples success',
        data: samples,
    });
});

module.exports = getSamples;
