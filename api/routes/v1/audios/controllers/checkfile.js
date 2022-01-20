const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');
const asyncAudioValidate = require('../../public/asyncAudioValidate.js');

const checkfile = asyncErrorWrapper(async (req, res, next) => {
    const metadata = await asyncAudioValidate(
        req.files.audio.filepath,
        req.logger,
    );

    if (metadata == null) {
        const err = new Error('validation failed[no metadata!]');
        err.status = 452;
        throw err;
    } else if (metadata.streams[0].codec_type !== 'audio') {
        const err = new Error('validation failed[not audio file!]');
        err.status = 453;
        throw err;
    } else if (metadata.streams[0].duration > 600) {
        const err = new Error(
            'validation failed[too long, over than 10 minutes!]',
        );
        err.status = 454;
        throw err;
    }
    next();
});

module.exports = checkfile;
