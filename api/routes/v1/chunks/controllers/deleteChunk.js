const Chunk = require('../../../../../models/v1/chunk/index');
const asyncAudioDelete = require('../../public/asyncAudioDelete');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const deleteChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({ _id: req.params.id }).exec();

    if (chunk == null) {
        const err = new Error(`Cannot find ${req.params.id}`);
        err.status = 404;
        throw err;
    }

    await Chunk.deleteOne({ _id: req.params.id }).exec();

    const audios = [chunk['source_wave_url'], chunk['target_wave_url']];

    audios.forEach(audio => {
        asyncAudioDelete(req.gcStorage, audio, req.logger);
    });

    res.status(200).json({
        message: `Delete success [delete ${req.params.id}]`,
        data: {},
    });
});

module.exports = deleteChunk;
