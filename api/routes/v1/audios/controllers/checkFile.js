const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncAudioInfo = require('../../../../../utils/asyncAudioInfo.js');
const asyncFileDelete = require('../../../../../utils/asyncFileDelete.js');

const checkFile = asyncErrorWrapper(async (req, res, next) => {
    const filepath = req.files.audio.filepath;
    const metadata = await asyncAudioInfo(filepath);

    if (metadata == null) {
        const err = new Error('validation failed[no metadata!]');
        err.status = 452;
        asyncFileDelete(filepath);
        throw err;
    } else if (metadata.streams[0].codec_type !== 'audio') {
        const err = new Error('validation failed[not audio file!]');
        err.status = 453;
        console.log(filepath);
        asyncFileDelete(filepath);
        throw err;
    } else if (metadata.streams[0].duration > 600) {
        const err = new Error(
            'validation failed[too long, over than 10 minutes!]',
        );
        err.status = 454;
        asyncFileDelete(filepath);
        throw err;
    }
    req.duration = metadata.streams[0].duration;
    next();
});

module.exports = checkFile;
