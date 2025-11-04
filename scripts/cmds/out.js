module.exports = {
  config: {
    name: "out",
    version: "1.0.5",
    hasPermssion: 2,
    credits: "Rasel Mahmud",
    description: "Bot leaves the group (owner only)",
    commandCategory: "system",
    usages: "",
    cooldowns: 3,
  },

  // ✅ শুধুমাত্র নির্দিষ্ট UID ব্যবহার করতে পারবে
  onStart: async function ({ api, event }) {
    const ownerUID = "100024220812646"; // 👉 এখানে তোমার UID বসাও
    const { threadID, senderID } = event;

    if (senderID !== ownerUID)
      return api.sendMessage("⚠️ Only the bot owner can use this command.", threadID);

    return api.sendMessage("👋 Leaving this group...", threadID, () => {
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    });
  },

  // ✅ কেউ “out” লিখলে কিন্তু শুধু owner হলে কাজ করবে
  handleEvent: async function ({ api, event }) {
    const { threadID, body, senderID } = event;
    if (!body) return;

    const ownerUID = "100024220812646"; // 👉 এখানে তোমার UID বসাও
    const msg = body.toLowerCase().trim();
    const triggers = ["out", "leave", "exit"];

    if (triggers.includes(msg)) {
      if (senderID !== ownerUID)
        return; // অন্য কেউ লিখলে কিছুই হবে না
      return api.sendMessage("👋 Leaving this group...", threadID, () => {
        api.removeUserFromGroup(api.getCurrentUserID(), threadID);
      });
    }
  },
};
