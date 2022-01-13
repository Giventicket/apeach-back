const axios = require("axios");

module.exports = async (req, chunk) => {
    await axios.post(process.env.DISCORD_WEBHOOK, {
        embeds: [{
            author: {
                name: `${ process.env.NODE_ENV === 'test'? "Backend Scenario Test" : "anonymous user"}`
            },
            description: `소스 음성: [source_wave_url](${chunk["source_wave_url"]}) \n\n소스 텍스트: ${chunk["source_text"]} \n\n타켓 텍스트: ${chunk["target_text"]} \n\n타겟 음성: [target_wave_url](${chunk["target_wave_url"]})`,
            timestamp: chunk["createdAt"]
        }],
        username: "Apeach-backend",
        avatar_url: process.env.LOGO_URL
    }).catch((err) => {
        req.logger.error(`status: ${(err.status || 500)}, message: ${err}`);
    });
};