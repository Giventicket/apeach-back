const axios = require('axios');
const fs = require('fs');
const { v4 } = require('uuid');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const gcpStorage = require('../../../../../utils/gcpStorage.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');

const tts = asyncErrorWrapper(async (req, res, next) => {
    const ttsResult = await axios
        .post(
            `${process.env.INFERENCE_SERVER}/api/custom_tts`,
            {
                sourceWaveUrl: 'string',
                segments: [
                    {
                        startTime: 0,
                        endTime: 0,
                        sourceText: '',
                        targetText:
                            'The voice you are hearing now is a voice created by Team Apeach. If you would like to convert to my voice, please select me. have a nice day',
                    },
                ],
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

    const filename = `audio/sentence/chunk/${v4()}.wav`;

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

    req.sampleSentenceUrl = gcpResult[0].metadata.mediaLink;

    next();
});

module.exports = tts;
