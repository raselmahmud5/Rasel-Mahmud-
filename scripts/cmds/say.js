const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Rasel Mahmud",
    description: "Make the bot say text in audio form (TTS)",
    commandCategory: "Fun",
    usages: "[text]",
    cooldowns: 3,
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    let text = args.join(" ");

    // যদি রিপ্লাই করা মেসেজ থাকে, সেটার টেক্সট নেবে
    if (!text && messageReply && messageReply.body) {
      text = messageReply.body;
    }

    // যদি কিছুই না থাকে
    if (!text)
      return api.sendMessage("🗣️ লিখো কিছু যাতে আমি বলি!", threadID, messageID);

    try {
      // tts API (Google Translate TTS)
      const lang = "en"; // চাইলে "bn" দিলে বাংলায় বলবে
      const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${lang}&client=tw-ob`;

      const cachePath = path.join(__dirname, "cache", `say_${Date.now()}.mp3`);
      const response = await axios.get(ttsURL, { responseType: "arraybuffer" });
      fs.writeFileSync(cachePath, Buffer.from(response.data, "utf-8"));

      return api.sendMessage(
        {
          body: `🎧 "${text}"`,
          attachment: fs.createReadStream(cachePath),
        },
        threadID,
        () => fs.unlinkSync(cachePath),
        messageID
      );
    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ অডিও তৈরি করতে সমস্যা হয়েছে!", threadID, messageID);
    }
  },
};
