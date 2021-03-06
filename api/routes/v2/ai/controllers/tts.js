const axios = require('axios');
const url = require('url');
const fs = require('fs');
const { v4 } = require('uuid');

const User = require('../../../../../models/v2/user/index');
const Chunk = require('../../../../../models/v2/chunk/index');
const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const tts = asyncErrorWrapper(async (req, res, next) => {
    const { chunk, user, isAuthUser } = req;

    // const parsedAudioUrl = url.parse(chunk.sourceWaveUrl).pathname.split('/');
    // const gs_uri = `gs://${process.env.BUCKET_NAME}/${decodeURIComponent(
    //     parsedAudioUrl[parsedAudioUrl.length - 1],
    // )}`;

    const ttsResult = await axios
        .post(
            `${process.env.AI_SERVER}/api/tts`,
            {
                sourceWaveUrl: chunk.sourceWaveUrl,
                segments: chunk.segments,
                spk_id: req.params.speakerName,
            },
            { responseType: 'arraybuffer' },
        )
        .catch(err => {
            err.status = err.response.status;
            err.message = err.response.data.message;
            throw err;
        });

    const tmpPath = `./${v4()}`;
    await fs.writeFileSync(tmpPath, ttsResult.data);

    const filename = isAuthUser
        ? `audio/${user.name}/chunk/${user.chunksAudioCnt}.wav`
        : `audio/anonymous/chunk/${v4()}.wav`;

    const gcpResult = await gcpStorage
        .bucket(process.env.BUCKET_NAME)
        .upload(tmpPath, {
            destination: filename,
            metadata: {
                contentType: 'audio/wave',
            },
        })
        .catch(err => {
            asyncFileDelete(tmpPath);
            throw err;
        });

    asyncFileDelete(tmpPath);

    const updatedChunk = await Chunk.findOneAndUpdate(
        { _id: chunk._id },
        {
            targetWaveUrl: gcpResult[0].metadata.mediaLink,
            speakerName: req.params.speakerName,
        },
        { new: true },
    ).exec();

    if (isAuthUser)
        await User.updateOne(
            { _id: user._id },
            {
                chunksAudioCnt: user.chunksAudioCnt + 1,
            },
            { new: true },
        ).exec();

    const speakerD = `????????? ??????: ${updatedChunk.speakerName}\n\n`;
    const sourceD = `?????? ??????: [sourceWaveUrl](${updatedChunk.sourceWaveUrl})\n`;
    const targetD = `?????? ??????: [targetWaveUrl](${updatedChunk.targetWaveUrl})\n\n`;
    let segsD = '';
    for (let idx in updatedChunk.segments) {
        const seg = updatedChunk.segments[idx];
        const segD = `  ???????????? [${idx}]:\n    ??????: ${seg.startTime}\n    ???: ${seg.endTime}\n    ?????? ?????????: ${seg.sourceText}\n    ?????? ?????????: ${seg.targetText}\n\n`;
        segsD += segD;
    }

    asyncSendWebhook(
        speakerD + sourceD + targetD + segsD,
        chunk['createdAt'],
        isAuthUser ? user.email : 'anonymous',
    );

    res.status(200).json({
        message: `tts request success`,
        data: updatedChunk,
    });
});

module.exports = tts;
