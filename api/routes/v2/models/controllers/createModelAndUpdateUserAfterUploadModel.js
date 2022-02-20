const nodemailer = require('nodemailer');

const Model = require('../../../../../models/v2/model/index');
const User = require('../../../../../models/v2/user/index');

const asyncErrorWrapper = require('../../../../../utils/asyncErrorWrapper.js');
const asyncSendWebhook = require('../../../../../utils/asyncSendWebhook');

const createModelAndUpdateUserAfterUploadModel = asyncErrorWrapper(
    async (req, res, next) => {
        const { modelUrl, user } = req;

        const model = await Model.create({
            speakerName: req.params.speakerName,
            modelUrl: modelUrl,
        });

        user.models.push(model._id);

        await User.updateOne(
            { _id: user._id },
            {
                models: user.models,
            },
        ).exec();

        asyncSendWebhook(
            `새로운 model 등록 완료! __**${user.name}**__님의 총 모델의 개수는 ${user.models.length}개 입니다.`,
            model.createdAt,
            user.email,
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
            to: user.email,
            subject: `[Team Apeach (pathfinder)] Apeach에서 ${user.name}님의 모델 학습이 완료되었음을 공지드립니다.`,
            html:
                '<h1>[Team Apeach (pathfinder)] Apeach에서 모델 학습이 완료되었음을 공지드립니다. </h1>' +
                `<h1> ${user.name}님의 모델명은 ${
                    user.name
                }이며 파이널 쇼케이스에서 공개 여부에 ${
                    user.agreed ? '동의' : '비동의'
                }하셨습니다. </h1>`,
        };
        transporter.sendMail(emailOptions);

        res.status(200).json({
            message: `upload success [upload a model on google bucket]`,
            data: model,
        });
    },
);

module.exports = createModelAndUpdateUserAfterUploadModel;
