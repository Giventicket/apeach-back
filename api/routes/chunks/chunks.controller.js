const url = require('url');
const Chunk = require('../../../models/chunk');

const createChunk = async (req, res, next) => {
    try {
        const chunk = await Chunk.create({
            source_wave_url: req.body.source_wave_url,
        });
        res.status(201).json({ 
            message: `Create success[create ${chunk._id}}]`, 
            data: chunk 
        });
    } catch (error) {
        //console.log(error);
        next(error);
    }
}

const getChunk = async (req, res, next) => {
    try {
        const chunk = await Chunk.find({_id: req.params.id}); 
        console.log(chunk.length);
        if(chunk.length == 0)
            res.status(404).json({ 
                message: `Cannot find ${req.params.id}`, 
                data: {} 
            });
        res.status(200).json({ 
            message: `Find success [find ${req.params.id}]`, 
            data: chunk 
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getChunks = async (req, res, next) => {
    try {
        const chunks = await Chunk.find({});
        res.status(200).json({ 
            message: "Find success [find all]", 
            data: chunks 
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateChunk = async (req, res, next) => {
    try {
        const result = await Chunk.findOneAndUpdate({ _id: req.params.id }, { 
            status: req.body.status,
            source_wave_url: req.body.source_wave_url,
            source_text: req.body.source_text,
            target_text: req.body.target_text,
            target_wave_url: req.body.target_wave_url,
        });
        if (result === null) 
             res.status(404).json({ 
                 message: `Cannot find ${req.params.id}`, 
                 data: {} 
             });
        const chunk = await Chunk.find({_id: req.params.id}); 
        res.status(200).json({ 
            message: `update success [find ${req.params.id}]`, 
            data: chunk 
        });
        console.log(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}



const deleteChunk = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        const chunk = await Chunk.find({_id: req.params.id}); 
        let messageFromBucket = "";
        if (chunk.length === 0) {
            res.status(404).json({ 
                message: `Cannot find ${req.params.id}`, 
                data: {} 
            });        
        }
        await Chunk.deleteOne({ _id: req.params.id });
        const audios = [chunk[0]["source_wave_url"], chunk[0]["target_wave_url"]];
        audios.forEach(async (audio) => {
            try {
                const parsedAudio = url.parse(audio).path.split("/");
                console.log(parsedAudio);
                await gcStorage.bucket('apeach-bucket').file(parsedAudio[2]).delete();                     
                messageFromBucket += `(From Google Bucket)${parsedAudio[2]} is deleted on google bucket!\n`;   
                console.log(`${parsedAudio[2]} is deleted on google bucket!`);
            } catch(error) {
                messageFromBucket += "(From Google Bucket)"+error.message;
                console.log(error.message);
            }
        });
        res.status(200).json({
            message: `Delete success [delete ${req.params.id}]`,
            data: {}
        });
    } catch (error) {
        console.log(error);
        next(error);
    }  
}

const deleteChunks = async (req, res, next) => {
    try {
        const gcStorage = req.gcStorage;
        const chunks = await Chunk.find({}); 
        await Chunk.deleteMany({ });
        let messageFromBucket = "";
        chunks.forEach((chunk) => {
            const audios = [chunk["source_wave_url"], chunk["target_wave_url"]];
            audios.forEach(async (audio) => {
                try {
                    const parsedAudio = url.parse(audio).path.split("/");
                    await gcStorage.bucket('apeach-bucket').file(parsedAudio[2]).delete();
                    messageFromBucket += `(From Google Bucket)${parsedAudio[2]} is deleted on google bucket!\n`;
                    console.log(`${parsedAudio[2]} is deleted on google bucket!`);
                } catch(error) {
                    console.log(error.message);
                    messageFromBucket += "(From Google Bucket)"+error.message;
                }
            });
        });
        res.status(200).json({
            message: "Delete success [delete all]\n" + messageFromBucket,
            data: {}
        });
    } catch (error) {
        console.log(error);
        next(error);
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