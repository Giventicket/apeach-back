const axios = require('axios');
const url = require('url');
const stream = require('stream');
const fs = require('fs');
const { v4 } = require('uuid');

const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');

const streamFileUpload = (buffer, filename) => {
    const file = gcpStorage.bucket(process.env.BUCKET_NAME).file(filename);

    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(buffer);
    passthroughStream.end();

    return new Promise((resolve, reject) => {
        passthroughStream
            .pipe(file.createWriteStream())
            .on('finish', data => {
                resolve(data);
            })
            .on('error', err => {
                return reject(err);
            });
    });
};

const tts = asyncErrorWrapper(async (req, res, next) => {
    const { chunk, chunkId, user, userId, isAuthUser } = req;

    const parsedAudioUrl = url.parse(chunk.source_wave_url).pathname.split('/');
    const gs_uri = `gs://${process.env.BUCKET_NAME}/${decodeURIComponent(
        parsedAudioUrl[parsedAudioUrl.length - 1],
    )}`;

    const result = await axios
        .post(
            `${process.env.AI_SERVER}/api/tts`,
            {
                gs_uri,
                segments: chunk.segments,
                spk_id: req.params.speakerId,
            },
            { responseType: 'arraybuffer' },
        )
        .catch(err => {
            err.status = err.response.status;
            err.message = err.response.data.message;
            throw err;
        });

    const tmpPath = `./${v4()}`;
    await fs.writeFileSync(tmpPath, result.data);

    const filename = isAuthUser
        ? `audio/${user.name}/chunk/${user.chunksAudioCnt + 1}.wav`
        : `audio/anonymous/chunk/${v4()}.wav`;

    const info = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(tmpPath, {
            destination: filename,
            metadata: {
                contentType: 'audio/wave',
            },
        })
        .catch(err => {
            asyncFileDelete(filename);
            throw err;
        });

    asyncFileDelete(filename);

    const updatedChunk = await Chunk.findOneAndUpdate(
        { _id: chunkId },
        {
            status: '3',
            target_wave_url: info[0].metadata.mediaLink,
        },
        { new: true },
    ).exec();

    if (isAuthUser) {
        user.chunks.push(req.params.id);

        await User.updateOne(
            { _id: req.userId },
            {
                chunks: user.chunks,
                chunksAudioCnt: user.chunksAudioCnt + 1,
            },
            { new: true },
        ).exec();
    }
    res.status(200).json({
        message: `tts request success`,
        data: updatedChunk,
    });
});

module.exports = tts;
