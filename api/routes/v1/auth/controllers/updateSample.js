const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateSample = asyncErrorWrapper(async (req, res, next) => {
    const sample = await Sample.findOneAndUpdate(
        { _id: req.params.id },
        {
            text: req.body.text,
            wave_url: req.body.wave_url,
        },
        { new: true },
    ).exec();

    if (sample == null) {
        const err = new Error(`Cannot find sample`);
        err.status = 404;
        throw err;
    }

    const user = await User.findOne({ _id: req.userId })
        .populate('samples')
        .populate('chunks')
        .exec();

    if (user == null) {
        const err = new Error(`Cannot find user`);
        err.status = 404;
        throw err;
    }

    res.status(200).json({
        message: `Update sample on user success`,
        data: user,
    });
});

module.exports = updateSample;
