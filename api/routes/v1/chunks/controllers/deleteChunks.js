const Chunk = require('../../../../../models/v1/chunk/index');
const asyncAudioDelete = require('../../public/asyncAudioDelete');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const deleteChunks = asyncErrorWrapper(async (req, res, next) => {
    return Chunk.find({})
        .exec()
        .then(chunks => {
            Chunk.deleteMany({})
                .exec()
                .then(() => {
                    chunks.forEach(chunk => {
                        const audios = [
                            chunk['source_wave_url'],
                            chunk['target_wave_url'],
                        ];
                        audios.forEach(audio => {
                            asyncAudioDelete(req.gcStorage, audio, req.logger);
                        });
                    });

                    res.status(200).json({
                        message: 'Delete success [delete all]',
                        data: {},
                    });
                })
                .catch(err => {
                    throw err;
                });
        });
});

module.exports = deleteChunks;
