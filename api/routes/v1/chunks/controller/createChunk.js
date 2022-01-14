const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../asyncErrorWrapper.js');

const createChunk = asyncErrorWrapper(async (req, res, next) => {
    const chunk = await Chunk.create({
        source_wave_url: req.body.source_wave_url,
    });
    res.status(201).json({ 
        message: `Create success[create ${ chunk._id }}]`, 
        data: chunk 
    });
});

module.exports = createChunk;
