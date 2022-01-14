const axios = require("axios");

const syncDiscordWebhook = async (req, chunk) => {
    const sourceD = `소스 음성: [source_wave_url](${chunk["source_wave_url"]})\n`;
    const targetD = `타겟 음성: [target_wave_url](${chunk["target_wave_url"]})\n\n`;
    let segsD = "";
    for (let idx in chunk["segments"]) {
        const seg = chunk["segments"][idx];
        const segD = `  세그먼트 [${idx}]:\n    시작: ${seg["start_time"]}\n    끝: ${seg["end_time"]}\n    소스 텍스트: ${seg["source_text"]}\n    타겟 텍스트: ${seg["target_text"]}\n\n`;
        segsD += segD;
    }
    await axios.post(process.env.DISCORD_WEBHOOK, {
        embeds: [{
            author: {
                name: `${ process.env.NODE_ENV === 'test'? "Backend Scenario Test" : "anonymous user"}`
            },
            description: sourceD + targetD + segsD,
            timestamp: chunk["createdAt"]
        }],
        username: "Apeach-backend",
        avatar_url: process.env.LOGO_URL
    }).catch((err) => {
        req.logger.error(`status: ${(err.status || err.code ||  500)}, message: ${err}`);
    });
};

module.exports = syncDiscordWebhook;