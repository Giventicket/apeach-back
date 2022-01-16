const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const getChunks = asyncErrorWrapper(async (req, res, next) => {
    const chunks = await Chunk.find({ });
    res.status(200).json({ 
        message: "Find success [find all]", 
        data: chunks 
    });
});

module.exports = getChunks;