const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "girl",
    version: "1.0.0",
    author: "XaviaTeam (Modified by Rasel Mahmud)",
    countDown: 3,
    role: 0,
    aliases: ["gai"],
    shortDescription: "Sends a random beautiful girl photo.",
    longDescription: "Fetches and sends a random girl image from the internet.",
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // ✅ You can replace this API link with your own
      const url = "https://api.waifu.pics/sfw/waifu";

      const res = await axios.get(url);
      const imgUrl = res.data.url;

      if (!imgUrl) {
        return api.sendMessage("⚠️ Failed to fetch image. Please try again later.", event.threadID, event.messageID);
      }

      const imgPath = __dirname + `/cache/girl_${Date.now()}.jpg`;
      const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgData.data, "binary"));

      api.sendMessage(
        { body: "💖 Here's a beautiful girl photo 🌸", attachment: fs.createReadStream(imgPath) },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Something went wrong! Please try again.", event.threadID, event.messageID);
    }
  }
};
