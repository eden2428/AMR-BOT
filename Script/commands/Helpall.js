// const fs = require("fs-extra"); // প্রয়োজন নেই
// const request = require("request"); // প্রয়োজন নেই

module.exports.config = {
 name: "helpall",
 version: "1.0.2", // Version updated
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐒𝐀𝐇𝐔",
 description: "Displays all available commands in one page",
 commandCategory: "system",
 usages: "[No args]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;

 const allCommands = [];

 for (let [name] of commands) {
 if (name && name.trim() !== "") {
 allCommands.push(name.trim());
 }
 }

 allCommands.sort();

 const finalText = `╔═══❖ 🌟 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌟 ❖═══╗
${allCommands.map(cmd => `║ ➔ ${cmd}`).join("\n")}
╠═════🔰 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🔰═════╣
║ 🤖 𝐁𝐨𝐭: ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
║ 👑 𝐎𝐰𝐧𝐞𝐫: 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓 𝐒𝐀𝐇𝐔
║ 📦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${allCommands.length} 
╚═══════════════════════╝`;

 // শুধু টেক্সট মেসেজ পাঠানো হচ্ছে
 api.sendMessage(finalText, threadID, messageID);
};
