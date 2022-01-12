const axios = require("axios");

const asyncDiscordWebhook = async (req, chunk) => {
    await axios.post(process.env.DISCORD_WEBHOOK, {
        embeds: [{
            author: {
                name: "anonymous user"
            },
            description: `소스 음성: [source_wave_url](${chunk["source_wave_url"]}) \n소스 텍스트: ${chunk["source_text"]} \n타켓 텍스트: ${chunk["target_text"]} \n타겟 음성: [target_wave_url](${chunk["target_wave_url"]})`,
            timestamp: chunk["createdAt"]
        }],
        username: "Apeach-backend",
        avatar_url: process.env.LOGO_URL
    }).catch((err) => {
        req.logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}`);
    });
};

module.exports = asyncDiscordWebhook;