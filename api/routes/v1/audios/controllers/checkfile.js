const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');
const syncAudioValidate = require('../../public/syncAudioValidate.js');

const checkfile = asyncErrorWrapper((req, res, next) => {
	return syncAudioValidate(req.files.audio.filepath).then(metadata => {
		if (metadata == null) {
			const err = new Error('validation failed[no metadata!]');
			err.status = 452;
			throw err;
		} else if (metadata.streams[0].codec_type !== 'audio') {
			const err = new Error('validation failed[not audio file!]');
			err.status = 453;
			throw err;
		} else if (metadata.streams[0].duration > 600) {
			const err = new Error('validation failed[too long, over than 10 minutes!]');
			err.status = 454;
			throw err;
		}
		next();
	});
});

module.exports = checkfile;
