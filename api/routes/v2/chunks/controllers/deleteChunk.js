const Chunk = require('../../../../../models/v2/chunk/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const deleteChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({ _id: req.params.id }).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find a chunk`);
        err.status = 404;
        throw err;
    }

    if (req.isAuthUser && chunk.userName !== req.user.name) {
        const err = new Error(`${req.user.name} does not own chunk`);
        err.status = 404;
        throw err;
    }

    await Chunk.deleteOne({ _id: req.params.id }).exec();

    const audios = [chunk['sourceWaveUrl'], chunk['targetWaveUrl']];
    req.deletedAudioCnt = 0;
    for (const audio of audios) {
        if (audio) req.deletedAudioCnt++;
    }

    audios.forEach(audio => {
        asyncAudioDelete(audio);
    });

    next();
});

module.exports = deleteChunk;
