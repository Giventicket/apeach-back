const Chunk = require('../../../../../models/v1/chunk/index');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const updateChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOneAndUpdate(
        { _id: req.params.id },
        {
            status: req.body.status,
            source_wave_url: req.body.source_wave_url,
            segments: req.body.segments,
            target_wave_url: req.body.target_wave_url,
        },
        { new: true },
    ).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }

    if (chunk.status === '3') {
        asyncSendWebhook(chunk);
    }

    res.status(200).json({
        message: `update success [find ${req.params.id}]`,
        data: chunk,
    });
});

module.exports = updateChunk;
