const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "x",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Rasel Mahmud",
    description: "🎙️ Bot will speak your text in Bangla voice",
    commandCategory: "Fun",
    usages: "[text or reply]",
    cooldowns: 3,
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    let text = args.join(" ");

    // যদি reply করা মেসেজে কিছু লেখা থাকে
    if (!text && messageReply && messageReply.body) text = messageReply.body;

    if (!text)
      return api.sendMessage("🗣️ কিছু লিখো যাতে আমি বাংলায় বলি!", threadID, messageID);

    try {
      // Google TTS (Bangla voice)
      const lang = "bn"; // বাংলা ভাষা
      const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${lang}&client=tw-ob`;

      const filePath = path.join(__dirname, "cache", `x_${Date.now()}.mp3`);
      const response = await axios.get(ttsURL, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

      api.sendMessage(
        {
          body: `🎧 বলা হচ্ছে:\n「 ${text} 」`,
          attachment: fs.createReadStream(filePath),
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ অডিও বানাতে সমস্যা হয়েছে, পরে আবার চেষ্টা করো!", threadID, messageID);
    }
  },
};
