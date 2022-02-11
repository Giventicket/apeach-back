const axios = require('axios');
const Chunk = require('../../../../../models/v2/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const translate = asyncErrorWrapper(async (req, res, next) => {
    const { chunk, chunkId } = req;

    const result = await axios
        .post(`${process.env.AI_SERVER}/api/translate`, {
            segments: chunk.segments,
        })
        .catch(err => {
            err.status = err.response.status;
            err.message = err.response.data.message;
            throw err;
        });

    const updatedChunk = await Chunk.findOneAndUpdate(
        { _id: chunkId },
        {
            segments: result.data.data,
        },
        { new: true },
    ).exec();

    res.status(200).json({
        message: `translate request success`,
        data: updatedChunk,
    });
});

module.exports = translate;
