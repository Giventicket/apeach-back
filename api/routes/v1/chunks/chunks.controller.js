const Chunk = require('../../../../models/v1/chunk/index');
const asyncDiscordWebhook = require("../public/asyncDiscordWebhook");
const asyncAudioDelete = require("../public/asyncAudioDelete");
const { asyncErrorWrapper } = require('../../asyncErrorWrapper.js');

const createChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.create({
        source_wave_url: req.body.source_wave_url,
    });
    res.status(201).json({ 
        message: `Create success[create ${ chunk._id }}]`, 
        data: chunk 
    });
});

const getChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({_id: req.params.id}); 
    if (chunk.length == 0) {
        const err = new Error(`Cannot find ${ req.params.id }`);
        err.status = 404;
        throw err;
    }
    res.status(200).json({ 
        message: `Find success [find ${ req.params.id }]`, 
        data: chunk 
    });
});

const getChunks = asyncErrorWrapper(async (req, res, next) => {
    const chunks = await Chunk.find({ });
    res.status(200).json({ 
        message: "Find success [find all]", 
        data: chunks 
    });
});

const updateChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOneAndUpdate({ _id: req.params.id }, { 
        status: req.body.status,
        source_wave_url: req.body.source_wave_url,
        segments: req.body.segments,
        target_wave_url: req.body.target_wave_url,
    }, {new: true});
    if (chunk === null || chunk === undefined) {
        const err = new Error(`Cannot find ${ req.params.id }`);
        err.status = 404;
        throw err;
    }
    if(chunk.status === "3"){
        asyncDiscordWebhook(req, chunk);
    }
    res.status(200).json({ 
        message: `update success [find ${ req.params.id }]`, 
        data: chunk
    });
});

const deleteChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.findOne({_id: req.params.id}); 
    if (chunk.length === 0) {
        const err = new Error(`Cannot find ${ req.params.id }`);
        err.status = 404;
        throw err;
    }
    await Chunk.deleteOne({ _id: req.params.id });
    const audios = [chunk["source_wave_url"], chunk["target_wave_url"]];

    for(const audio of audios){
        await asyncAudioDelete(req.gcStorage, audio, req.logger);
    }
    res.status(200).json({
        message: `Delete success [delete ${ req.params.id }]`,
        data: { }
    }); 
});

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


module.exports = {
    createChunk,
    getChunk,
    getChunks,
    updateChunk,
    deleteChunk,
    deleteChunks
};