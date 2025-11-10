const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "wallpaper",
    version: "1.0.0",
    author: "XaviaTeam (Modified by Rasel Mahmud)",
    countDown: 3,
    role: 0,
    aliases: ["anhnen", "wp"],
    shortDescription: "Send random anime wallpaper",
    longDescription: "Get a random beautiful anime wallpaper from API",
    category: "fun",
    guide: {
      en: "{pn} - Sends a random anime wallpaper"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const url = `https://api.waifu.pics/sfw/waifu`; // ✅ You can replace this with your custom API
      const res = await axios.get(url);

      const imgUrl = res.data.url;
      if (!imgUrl) {
        return api.sendMessage("⚠️ Couldn't fetch wallpaper, try again later.", event.threadID, event.messageID);
      }

      const imgPath = __dirname + `/cache/wallpaper_${Date.now()}.jpg`;
      const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgData.data, "binary"));

      api.sendMessage(
        { body: `🌸 Here's your anime wallpaper:\n${imgUrl}`, attachment: fs.createReadStream(imgPath) },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Something went wrong, please try again later.", event.threadID, event.messageID);
    }
  }
};
