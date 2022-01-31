const Chunk = require('../../../../../models/v1/chunk/index');
const asyncAudioDelete = require('../../../../../utils/asyncAudioDelete');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const deleteChunks = asyncErrorWrapper(async (req, res, next) => {
    const chunks = await Chunk.find({});
    await Chunk.deleteMany({}).exec();
    chunks.forEach(chunk => {
        const audios = [chunk['source_wave_url'], chunk['target_wave_url']];
        audios.forEach(audio => {
            asyncAudioDelete(audio);
        });
    });

    res.status(200).json({
        message: 'Delete chunks success',
        data: {},
    });
});

module.exports = deleteChunks;
