const axios = require('axios');
const url = require('url');
const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const stt = asyncErrorWrapper(async (req, res, next) => {
    const { chunk, chunkId } = req;
    const parsedAudioUrl = url.parse(chunk.source_wave_url).pathname.split('/');
    filename = decodeURIComponent(parsedAudioUrl[parsedAudioUrl.length - 1]);
    const gs_uri = `gs://${process.env.BUCKET_NAME}/${filename}`;

    const option = req.params.option;

    const result = await axios
        .post(`${process.env.AI_SERVER}/api/${option}_stt`, {
            gs_uri,
        })
        .catch(err => {
            err.status = err.response.status || err.status;
            err.message = err.response.data.message || err.message;
            throw err;
        });

    const updatedChunk = await Chunk.findOneAndUpdate(
        { _id: chunkId },
        {
            status: '1',
            segments: result.data.data,
        },
        { new: true },
    ).exec();

    res.status(200).json({
        message: `stt request success`,
        data: updatedChunk,
    });
});

module.exports = stt;
