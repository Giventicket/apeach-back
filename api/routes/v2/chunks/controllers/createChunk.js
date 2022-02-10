const Chunk = require('../../../../../models/v2/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const createChunk = asyncErrorWrapper(async (req, res, next) => {
    const { user, isAuthUser } = req;
    const chunk = await Chunk.create({
        sourceWaveUrl: req.sourcWaveUrl,
        userName: isAuthUser ? user.name : 'anonymous',
        speakerName: req.params.speakerName,
    });
    req.chunk = chunk;
    next();
});

module.exports = createChunk;
