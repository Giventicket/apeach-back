const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const getChunks = asyncErrorWrapper(async (req, res, next) => {
    const chunks = await Chunk.find({}).exec();
    res.status(200).json({
        message: 'Find success [find all]',
        data: chunks,
    });
});

module.exports = getChunks;
