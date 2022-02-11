const axios = require('axios');
const url = require('url');
const Chunk = require('../../../../../models/v2/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');

const stt = asyncErrorWrapper(async (req, res, next) => {
    const { chunk } = req;
    const parsedAudioUrl = url.parse(chunk.sourceWaveUrl).pathname.split('/');
    filename = decodeURIComponent(parsedAudioUrl[parsedAudioUrl.length - 1]);
    const gs_uri = `gs://${process.env.BUCKET_NAME}/${filename}`;

    const option = chunk.duration > 55 ? 'long' : 'short';

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
        { _id: chunk._id },
        {
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
