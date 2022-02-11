const Chunk = require('../../../../../models/v2/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({ _id: req.params.id }).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find a chunk`);
        err.status = 404;
        throw err;
    }

    req.chunk = chunk;

    next();
});

module.exports = getChunk;
