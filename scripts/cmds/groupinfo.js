const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "groupinfo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Show group logo, name, admins and members (like the picture).",
  commandCategory: "group",
  usages: "",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  try {
    // ----- 1) get thread info -----
    const threadInfo = await api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName || threadInfo.name || "Unnamed Group";
    const imageSrc = threadInfo.imageSrc || threadInfo.threadImage || null;

    // ----- 2) admins and participants (frameworks differ slightly) -----
    // threadInfo.adminIDs is commonly an array of objects like [{id: '1000...'}, ...]
    const adminArray = threadInfo.adminIDs || threadInfo.admins || [];
    const admins = adminArray.map(a => (typeof a === 'string') ? a : (a.id || a._id || a));
    // participants may be in participantIDs or participants
    let participants = [];
    if (Array.isArray(threadInfo.participantIDs)) participants = threadInfo.participantIDs;
    else if (Array.isArray(threadInfo.participants)) participants = threadInfo.participants.map(p => p.id || p);
    else if (threadInfo.participantIDs && typeof threadInfo.participantIDs === 'object') participants = Object.keys(threadInfo.participantIDs);

    const memberCount = participants.length || 0;

    // ----- 3) fetch admin names (and build mention objects) -----
    const mentions = []; // for sending mentions in message body
    const adminNames = [];
    for (let id of admins) {
      try {
        const info = await api.getUserInfo(id);
        // api.getUserInfo usually returns object keyed by id
        const name = (info && info[id] && info[id].name) ? info[id].name : Object.values(info)[0] && Object.values(info)[0].name ? Object.values(info)[0].name : id;
        adminNames.push(name);
      } catch (e) {
        adminNames.push(id);
      }
    }

    // ----- 4) build a sample members list (first 40) and mentions -----
    const sample = participants.slice(0, 40);
    const sampleLines = [];
    let i = 0;
    for (let id of sample) {
      try {
        const info = await api.getUserInfo(id);
        const name = (info && info[id] && info[id].name) ? info[id].name : Object.values(info)[0] && Object.values(info)[0].name ? Object.values(info)[0].name : id;
        mentions.push({ id, tag: name });
        sampleLines.push(`${i + 1}. ${name}`);
      } catch (e) {
        sampleLines.push(`${i + 1}. ${id}`);
      }
      i++;
    }

    // ----- 5) prepare message body -----
    const body = 
`👥 Group Name: ${threadName}
🛡️ Admins (${admins.length}): ${adminNames.join(', ') || "No admin data"}
👤 Members: ${memberCount}

📋 Sample members (${sample.length}):
${sampleLines.join('\n')}
`;

    // ----- 6) optionally download group image and send as attachment -----
    if (imageSrc) {
      try {
        const res = await axios.get(imageSrc, { responseType: 'arraybuffer' });
        const ext = (res.headers['content-type'] || '').split('/')[1] || 'jpg';
        const tmpPath = path.join(__dirname, `tmp_thread_${threadID}.${ext}`);
        fs.writeFileSync(tmpPath, Buffer.from(res.data, 'binary'));
        // send with attachment and mentions so names are highlighted
        await api.sendMessage({ body, attachment: fs.createReadStream(tmpPath), mentions }, threadID, () => {
          // cleanup
          try { fs.unlinkSync(tmpPath); } catch(e) {}
        }, messageID);
      } catch (err) {
        // failed to download image: send without attachment
        await api.sendMessage({ body, mentions }, threadID, messageID);
      }
    } else {
      // no group image: just send text + mentions
      await api.sendMessage({ body, mentions }, threadID, messageID);
    }

  } catch (error) {
    console.error(error);
    await api.sendMessage(`দুঃখিত — গ্রুপ ইনফো আনা যায়নি।\nError: ${error.message || error}`, threadID, messageID);
  }
};
