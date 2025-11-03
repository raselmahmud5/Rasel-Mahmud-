const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

async function baseApiUrl() {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
    return res.data.api;
  } catch (e) {
    console.log("❌ baseApiUrl fetch error:", e.message);
    return null;
  }
}

module.exports = {
  config: {
    name: "album",
    version: "3.0",
    credits: "Rasel Mahmud",
    description: "Display and fetch album videos or add via reply",
    commandCategory: "media",
    cooldowns: 5,
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      api.setMessageReaction("💎", event.messageID, () => {}, true);
      const msg =
`╔══════════════════════╗
║ 🎵 𝗔𝗹𝗯𝘂𝗺 𝗩𝗶𝗱𝗲𝗼 𝗟𝗶𝘀𝘁 🎶
╠══════════════════════╣
║ 🎬 1. Funny Video
║ 🌙 2. Islamic Video
║ 💔 3. Sad Video
║ 🎎 4. Anime Video
║ 🐾 5. Cartoon Video
║ 🎧 6. Lofi Video
║ 🔥 7. Horny Video
║ 💑 8. Couple Video
║ 🌸 9. Flower Video
║ 🖼️ 10. Random Photo
║ 🌌 11. Aesthetic Video
║ 🦁 12. Sigma Rule
║ 🎶 13. Lyrics Video
║ 🐱 14. Cat Video
║ 🚫 15. 18+ Video
║ 🎮 16. Free Fire Video
║ ⚽ 17. Football Video
║ 👧 18. Girl Video
║ 🤝 19. Friends Video
║ 🏏 20. Cricket Video
╠══════════════════════╣
║ ✨ Reply a number (1-20)
╚══════════════════════╝`;

      return api.sendMessage(
        msg,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            type: "album",
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
          });
        },
        event.messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID != Reply.author) return;
    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > 20) {
      return api.sendMessage("⚠️ Please reply with a number between 1 and 20", event.threadID, event.messageID);
    }

    api.unsendMessage(Reply.messageID);

    const admin = "100024220812646"; // তোমার UID
    const categoryMap = {
      1: ["funny", "🤣 Naw Baby Funny Video"],
      2: ["islamic", "🕌 Naw Baby Islamic Video"],
      3: ["sad", "😢 Naw Baby Sad Video"],
      4: ["anime", "🎎 Naw Baby Anime Video"],
      5: ["cartoon", "🐾 Naw Baby Cartoon Video"],
      6: ["lofi", "🎧 Naw Baby Lofi Video"],
      7: ["horny", "🥵 Naw Baby Horny Video"],
      8: ["love", "😍 Naw Baby Love Video"],
      9: ["flower", "🌸 Naw Baby Flower Video"],
      10: ["photo", "🖼️ Naw Baby Random Photo"],
      11: ["aesthetic", "🌌 Naw Baby Aesthetic Video"],
      12: ["sigma", "🦁 Naw Baby Sigma Rule Video"],
      13: ["lyrics", "🎶 Naw Baby Lyrics Video"],
      14: ["cat", "🐱 Naw Baby Cat Video"],
      15: ["sex", "🚫 Naw Baby 18+ Video"],
      16: ["ff", "🎮 Naw Baby Free Fire Video"],
      17: ["football", "⚽ Naw Baby Football Video"],
      18: ["girl", "👧 Naw Baby Girl Video"],
      19: ["friend", "🤝 Naw Baby Friends Video"],
      20: ["cricket", "🏏 Naw Baby Cricket Video"],
    };

    const [query, caption] = categoryMap[choice];

    if ((choice === 7 || choice === 15) && event.senderID !== admin) {
      return api.sendMessage("⚠️ Only admin can access this category!", event.threadID, event.messageID);
    }

    try {
      const apiUrl = await baseApiUrl();
      const res = await axios.get(`${apiUrl}/album?type=${query}`);
      const fileUrl = res.data.data;
      const filePath = path.join(cacheDir, `album_${Date.now()}.mp4`);

      const fileData = await axios.get(fileUrl, { responseType: "
