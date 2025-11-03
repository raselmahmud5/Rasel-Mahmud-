const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "1.0.6",
    hasPermssion: 0,
    credits: "Rasel Mahmud",
    description: "বাংলা ভয়েসে বলবে",
    commandCategory: "utility",
    usages: "say <text>",
    cooldowns: 3,
  },

  onStart: async function ({ api, event, args }) {
    try {
      const text = args.join(" ").trim();
      if (!text)
        return api.sendMessage(
          "⚠️ ইউজেজ: say <টেক্সট>\nউদাহরণ: say তুমি কেমন আছো 💬",
          event.threadID,
          event.messageID
        );

      // cache folder তৈরি
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      // ভাষা সবসময় বাংলা
      const lang = "bn";

      // Google Translate TTS লিংক (বাংলা)
      const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${lang}&client=gtx`;

      const fileName = `say_${Date.now()}.mp3`;
      const filePath = path.join(cacheDir, fileName);

      // অডিও ডাউনলোড
      const res = await axios.get(ttsURL, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });

      await fs.writeFile(filePath, Buffer.from(res.data));

      // অডিও পাঠানো
      api.sendMessage(
        {
          body: "",
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
        },
        event.messageID
      );
    } catch (err) {
      console.log(err);
      api.sendMessage(
        "❌ বাংলা ভয়েস তৈরি করতে সমস্যা হয়েছে!",
        event.threadID,
        event.messageID
      );
    }
  },
};
