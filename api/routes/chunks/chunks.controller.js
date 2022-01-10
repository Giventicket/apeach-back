const url = require('url');
const Chunk = require('../../../models/chunk');
const axios = require("axios");

const createChunk = async (req, res, next) => {
    try {
        const chunk = await Chunk.create({
            source_wave_url: req.body.source_wave_url,
        });
        res.status(201).json({ 
            message: `Create success[create ${chunk._id}}]`, 
            data: chunk 
        });
    } catch (err) {
        next(err);
    }
}

const getChunk = async (req, res, next) => {
    try {
        const chunk = await Chunk.find({_id: req.params.id}); 
        if(chunk.length == 0){
            const err = new Error(`Cannot find ${req.params.id}`);
            err.status = 404;
            throw err;
        }
        res.status(200).json({ 
            message: `Find success [find ${req.params.id}]`, 
            data: chunk 
        });
    } catch (err) {
        next(err);
    }
}

const getChunks = async (req, res, next) => {
    try {
        const chunks = await Chunk.find({});
        res.status(200).json({ 
            message: "Find success [find all]", 
            data: chunks 
        });
    } catch (err) {
        next(err);
    }
}

const updateChunk = async (req, res, next) => {
    try {
        const chunk = await Chunk.findOneAndUpdate({ _id: req.params.id }, { 
            status: req.body.status,
            source_wave_url: req.body.source_wave_url,
            source_text: req.body.source_text,
            target_text: req.body.target_text,
            target_wave_url: req.body.target_wave_url,
        }, {new: true});
        if (chunk === null || chunk === undefined) {
            const err = new Error(`Cannot find ${req.params.id}`);
            err.status = 404;
            throw err;
        }
        if(chunk.status === "3"){
            req.logger.info(chunk);
            await axios.post(process.env.DISCORD_WEBHOOK, {
                content: String(chunk),
                username: "Backend server"
            }).catch((err) => {
                req.logger.error(`status: ${(err.status || 500)}, message: ${err}`);
            });
        }
        res.status(200).json({ 
            message: `update success [find ${req.params.id}]`, 
            data: [chunk]
        });
    } catch (err) {
        next(err);
    }
}

const asyncAudioDelete = async (gcStorage, audio, logger) => {
    try {
        const parsedAudio = url.parse(audio).path.split("/");
        await gcStorage.bucket('apeach-bucket').file(parsedAudio[2]).delete();                     
        logger.info(`[From Google Bucket] ${parsedAudio[2]} is deleted on google bucket!, `)
    } catch(err) {
        logger.error("[From Google Bucket] " + err.message);
    };
}

const deleteChunk = async (req, res, next) => {
    try {
        const chunk = await Chunk.find({_id: req.params.id}); 
        if (chunk.length === 0) {
            const err = new Error(`Cannot find ${req.params.id}`);
            err.status = 404;
            throw err;
        }
        await Chunk.deleteOne({ _id: req.params.id });
        const audios = [chunk[0]["source_wave_url"], chunk[0]["target_wave_url"]];

        for(const audio of audios){
            await asyncAudioDelete(req.gcStorage, audio, req.logger);
        }
        res.status(200).json({
            message: `Delete success [delete ${req.params.id}]`,
            data: {}
        });
    } catch (err) {
        next(err);
    } 
}

const deleteChunks = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        const chunks = await Chunk.find({}); 
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
    } catch (err) {
        next(err);
    }
}


module.exports = {
    createChunk,
    getChunk,
    getChunks,
    updateChunk,
    deleteChunk,
    deleteChunks
};