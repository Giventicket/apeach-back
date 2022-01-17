const Chunk = require('../../../../../models/v1/chunk/index');
const syncAudioDelete = require("../../public/syncAudioDelete");
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const deleteChunks = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const chunks = await Chunk.find({ }); 
    await Chunk.deleteMany({ });
    chunks.forEach(chunk =>{ 
        const audios = [chunk["source_wave_url"], chunk["target_wave_url"]];
        audios.forEach(audio =>{ syncAudioDelete(req.gcStorage, audio, req.logger) });
    });
    
    res.status(200).json({
        message: "Delete success [delete all]",
        data: {}
    });
});

module.exports = deleteChunks;