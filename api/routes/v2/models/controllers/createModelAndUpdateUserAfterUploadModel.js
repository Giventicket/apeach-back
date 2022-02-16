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

        res.status(200).json({
            message: `upload success [upload a model on google bucket]`,
            data: model,
        });
    },
);

module.exports = createModelAndUpdateUserAfterUploadModel;
