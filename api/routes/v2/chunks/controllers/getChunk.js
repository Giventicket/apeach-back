const Chunk = require('../../../../../models/v2/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({ _id: req.params.id }).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }

    res.status(200).json({
        message: `Find a chunk success`,
        data: chunk,
    });
});

module.exports = getChunk;
