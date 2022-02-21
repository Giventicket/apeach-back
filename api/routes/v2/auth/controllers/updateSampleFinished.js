const nodemailer = require('nodemailer');

const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhookForSampleFinished = require('../../../../../utils/asyncSendWebhookForSampleFinished');

const updateSampleFinished = asyncErrorWrapper(async (req, res, next) => {
    const { user } = req;
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            sampleFinished: true,
        },
        { new: true },
    ).exec();

    asyncSendWebhookForSampleFinished(
        `**주목!!**\n${
            updatedUser.name
        } 님은 모든 sample audio 업로드 완료하였습니다!\n목소리 공개의 동의 여부: __**${
            updatedUser.agreed ? '동의' : '비동의'
        }**__`,
        updatedUser.updatedAt,
        updatedUser.email,
    );

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.APEACH_EMAIL,
            pass: process.env.APEACH_PASSWORD,
        },
    });

    const emailOptions = {
        from: process.env.APEACH_EMAIL,
        to: updatedUser.email,
        subject: `[Team Apeach (pathfinder)] Apeach에서 ${updatedUser.name}님의 모델 학습이 신청되었음을 공지드립니다.`,
        html:
            `<h1>[Team Apeach (pathfinder)] Apeach에서 ${updatedUser.name}님의 모델 학습이 신청되었음을 공지드립니다.</h1>` +
            `<h1> ${updatedUser.name}님은 파이널 쇼케이스에서 공개 여부에 ${
                updatedUser.agreed ? '동의' : '비동의'
            }하셨습니다. </h1>` +
            `<h1>모델학습이 완료되면 다시 한번 이메일로 공지드리도록하겠습니다.</h1>`,
    };

    transporter.sendMail(emailOptions).catch(err => {});

    res.status(200).json({
        message: `Update an user success`,
        data: {
            name: updatedUser.name,
            samples: updatedUser.samples,
            chunks: updatedUser.chunks,
            samplesAudioCnt: updatedUser.samplesAudioCnt,
            chunksAudioCnt: updatedUser.chunksAudioCnt,
            agreed: updatedUser.agreed,
            sampleFinished: updatedUser.sampleFinished,
        },
    });
});

module.exports = updateSampleFinished;
