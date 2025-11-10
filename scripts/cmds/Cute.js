const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "cute",
    version: "1.0.0",
    author: "XaviaTeam (Modified by Rasel Mahmud)",
    countDown: 3,
    role: 0,
    shortDescription: "র্যান্ডম সুন্দর এনিমে মেয়ে পাঠাবে",
    longDescription: "একটি র‌্যান্ডম সুন্দর ও নিরীহ এনিমে গার্ল ইমেজ পাঠায়।",
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // ✅ Safe API for cute anime girls
      const url = "https://api.waifu.pics/sfw/waifu";
      const res = await axios.get(url);
      const imgUrl = res.data.url;

      const imgPath = __dirname + `/cache/cute_${Date.now()}.jpg`;
      const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgData.data, "binary"));

      api.sendMessage(
        { body: "🌸 এখানে তোমার কিউট এনিমে গার্ল 💖", attachment: fs.createReadStream(imgPath) },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ কিছু সমস্যা হয়েছে! অনুগ্রহ করে পরে আবার চেষ্টা করো।", event.threadID, event.messageID);
    }
  }
};
