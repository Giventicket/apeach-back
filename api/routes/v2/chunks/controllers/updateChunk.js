const Chunk = require('../../../../../models/v2/chunk/index');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOneAndUpdate(
        { _id: req.params.id },
        {
            status: req.body.status,
            sourceWaveUrl: req.body.sourceWaveUrl,
            segments: req.body.segments,
            targetWaveUrl: req.body.targetWaveUrl,
        },
        { new: true },
    ).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find a chunk`);
        err.status = 404;
        throw err;
    }

    // if (chunk.status === '3') {
    //     asyncSendWebhook(chunk);
    // }

    res.status(200).json({
        message: `Update a chunk success`,
        data: chunk,
    });
});

module.exports = updateChunk;
