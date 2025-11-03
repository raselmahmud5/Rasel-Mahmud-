module.exports = {
  config: {
    name: "babyhi",
    version: "2.0",
    author: "Rasel Mahmud",
    credit: "Rasel Mahmud",
    description: "Stylish auto reply with mention when someone says bot, heli, helilumo or lumo",
    category: "fun"
  },

  onStart: async function () {},

  onChat: async function ({ event, api }) {
    const body = (event.body || "").toLowerCase();
    const triggers = ["bot", "heli", "helilumo", "lumo"];

    if (triggers.some(word => body.includes(word))) {
      const senderID = event.senderID;

      // ইউজারের নাম নিয়ে আসা
      let name = "User";
      try {
        const userInfo = await api.getUserInfo(senderID);
        name = userInfo[senderID]?.name || "User";
      } catch (e) {}

      // সুন্দর স্টাইলিশ রিপ্লাই
      const msg = `𝗛𝗲𝘆 @${name} \n 𝗧𝘆𝗽𝗲 → *𝑩𝒂𝒃𝒚 𝒉𝒊`;

      api.sendMessage(
        {
          body: msg,
          mentions: [{ tag: `@${name}`, id: senderID }]
        },
        event.threadID,
        event.messageID
      );
    }
  }
};
