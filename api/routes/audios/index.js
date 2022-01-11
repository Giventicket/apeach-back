const express = require('express');
const controller = require('./audios.controller');

const router = express.Router();

const preprocess = async (req, res, next) => {
    try {
        //ffmpeg -i {input} -ar 16000 -ac 1 -sample_fmt s16 {output}
        let process = new ffmpeg(req.files.audio.filepath);
        process.then((audio) => {
            ffmpeg('/path/to/file.avi').inputOptions([
            '-option1',
            '-option2 param2',
            '-option3',
            '-option4 param4'
            ]);
        }, function (err) {
            console.log('Error: ' + err);
        });
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
}

// audio 저장하기
router.post('/upload', controller.parseForm, preprocess, upload.single('audio'), controller.uploadFile);
 
// audio 삭제하기
router.delete('/:filename', controller.deleteFile);

module.exports = router;