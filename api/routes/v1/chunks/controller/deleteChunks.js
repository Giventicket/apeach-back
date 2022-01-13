const Chunk = require('../../../../../models/v1/chunk/index');
const asyncAudioDelete = require("../../public/asyncAudioDelete");
const asyncErrorWrapper = require('../../../asyncErrorWrapper.js');

const deleteChunks = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const chunks = await Chunk.find({ }); 
    await Chunk.deleteMany({ });
    for(const chunk of chunks) {
        const audios = [chunk["source_wave_url"], chunk["target_wave_url"]];
        for(const audio of audios){
            await asyncAudioDelete(req.gcStorage, audio, req.logger);
        }
    };
    res.status(200).json({
        message: "Delete success [delete all]",
        data: {}
    });
});

module.exports = deleteChunks;