const User = require('../../../../../models/v1/user/index');
const Sample = require('../../../../../models/v1/sample/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const addSample = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

    const sample = await Sample.findOne({ _id: req.params.id }).exec();

    if (sample == null) {
        const err = new Error(`Cannot find a sample`);
        err.status = 404;
        throw err;
    }

    user.samples.push(req.params.id);

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        { samples: user.samples },
        { new: true },
    )
        .populate('samples')
        .populate('chunks')
        .exec();

    res.status(200).json({
        message: `Add a sample on user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
        },
    });
});

module.exports = addSample;
