const fs = require("fs");

module.exports.config = {
    name: "antiout",
    version: "1.0.3",
    credits: "Rasel Mahmud",
    hasPermssion: 1,
    description: "Prevent members from leaving the group silently (auto on)",
    usages: "antiout on/off",
    commandCategory: "system",
    cooldowns: 0
};

// 🟢 Goat v2 format uses onStart instead of run
module.exports.onStart = async function ({ api, event, Threads }) {
    const threadID = event.threadID;
    let data = (await Threads.getData(threadID)).data || {};

    if (typeof data["antiout"] == "undefined" || data["antiout"] == false) {
        data["antiout"] = true;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(parseInt(threadID), data);
        return api.sendMessage("✅ Antiout has been turned ON.", threadID);
    } else {
        data["antiout"] = false;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(parseInt(threadID), data);
        return api.sendMessage("❌ Antiout has been turned OFF.", threadID);
    }
};

// 🧩 Event handler: silently re-add user if antiout is enabled
module.exports.onEvent = async function ({ api, event, Threads }) {
    if (event.logMessageType === "log:unsubscribe") {
        const threadID = event.threadID;
        const leftUser = event.logMessageData.leftParticipantFbId;

        try {
            let threadData = global.data.threadData.get(parseInt(threadID)) || {};

            // Default = true (auto on)
            if (typeof threadData["antiout"] === "undefined") {
                threadData["antiout"] = true;
                await Threads.setData(threadID, { data: threadData });
                global.data.threadData.set(parseInt(threadID), threadData);
            }

            // If enabled, silently re-add user
            if (threadData["antiout"] === true) {
                await api.addUserToGroup(leftUser, threadID);
            }
        } catch (err) {
            console.error("Antiout Error:", err);
        }
    }
};
