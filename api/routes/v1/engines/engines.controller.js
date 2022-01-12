const fs = require('fs');
const syncParseForm = require('../public/syncParseForm.js');
const syncPreprocess = require('../public/syncPreprocess.js');
const asyncAudioDelete = require("../public/asyncAudioDelete");
const { asyncErrorWrapper } = require('../../asyncErrorWrapper.js');
const Chunk = process.env.NODE_ENV === 'production' ? require('../../../../models/chunk_v1') : require('../../../../models/chunk_v1_dev');


const parseForm = asyncErrorWrapper(async (req, res, next) => {
    await syncParseForm(req).then((files) => {
        if (Object.keys(files).length === 0) {
            const err = new Error("upload failed [no audio file]");
            err.status = 400;
            throw err;
        }
        req.files = files;
    }).catch((err) => { throw err; });
    next();
});


const preprocess = asyncErrorWrapper(async (req, res, next) => {
    await syncPreprocess(req.files.audio.filepath).then().catch((err) => { throw err; });
    next();
});

const upload = asyncErrorWrapper(async (req, res, next) => {
    const gcStorage = req.gcStorage;
    const result = await gcStorage.bucket(process.env.BUCKET_NAME).upload(`${req.files.audio.filepath}R`, {
        destination: `${req.files.audio.newFilename}R`,
        metadata: {
          contentType: 'audio/wave',
        },
    });
    const tmpFiles = [req.files.audio.filepath, `${req.files.audio.filepath}R`];
    tmpFiles.forEach((filepath) => {
        fs.unlink(filepath,(err)=>{ 
            if (err)
                req.logger.error(`status: ${(err.status || err.code || 500)}, message: ${err}`);
        });
    });    
    req.result = result;
    next();
});

const createChunk = asyncErrorWrapper(async (req, res, next) => {
    const result = req.result;
    const chunk = await Chunk.create({
        source_wave_url: result[0].metadata["mediaLink"],
        source_wave_name: result[0].metadata["name"],
    });
    res.status(201).json({ 
        message: `Create success[create ${ chunk._id }}]`, 
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
    const audios = [chunk["source_wave_name"], chunk["target_wave_name"]];

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
        const audios = [chunk["source_wave_name"], chunk["target_wave_name"]];
        for(const audio of audios){
            await asyncAudioDelete(req.gcStorage, audio, req.logger);
        }
    };
    res.status(200).json({
        message: "Delete success [delete all]",
        data: {}
    });
});

const getChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.find({_id: req.params.id}); 
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


module.exports = { parseForm, preprocess, upload, createChunk, deleteChunk, deleteChunks, getChunk, getChunks, updateChunk };