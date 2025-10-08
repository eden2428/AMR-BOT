const fs = require("fs-extra");

module.exports.config = {
    name: "help",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "𝐌𝐔𝐍𝐓𝐀𝐒𝐈𝐑 𝐌𝐀𝐇𝐌𝐔𝐃",
    description: "Shows all available commands",
    commandCategory: "system",
    usages: "[command name]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner: 𝐌𝐔𝐍𝐓𝐀𝐒𝐈𝐑 𝐌𝐀𝐇𝐌𝐔𝐃
╰━━━━━━━━━━━━━━━━╯`,
        "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]"
    }
};

module.exports.handleEvent = function () { return; };

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    // যদি কোনো নির্দিষ্ট command নাম দেওয়া হয়
    if (args[0] && commands.has(args[0].toLowerCase())) {
        const command = commands.get(args[0].toLowerCase());

        const detail = getText("moduleInfo",
            command.config.name,
            command.config.usages || "Not Provided",
            command.config.description || "Not Provided",
            command.config.hasPermssion,
            command.config.credits || "Unknown",
            command.config.commandCategory || "Unknown",
            command.config.cooldowns || 0,
            prefix,
            global.config.BOTNAME || "𝐘𝐎𝐔𝐑 মুরগির বাচ্চা 😘"
        );

        return api.sendMessage(detail, threadID, messageID);
    }

    // সব command একসাথে দেখানোর জন্য
    const allCommands = Array.from(commands.values())
        .filter(cmd => cmd.config && cmd.config.name)
        .sort((a, b) => a.config.name.localeCompare(b.config.name));

    let msg = allCommands.map(cmd => `┃ ✪ ${cmd.config.name} — ${cmd.config.description || "No description"}`).join("\n");

    const text = `╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 📜
┣━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━┫
┃ 🧮 Total: ${allCommands.length}
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot name: 𝐘𝐎𝐔𝐑 মুরগির বাচ্চা 😘
┃ 👑 Owner: 𝐌𝐔𝐍𝐓𝐀𝐒𝐈𝐑 𝐌𝐀𝐇𝐌𝐔𝐃
╰━━━━━━━━━━━━━━━━╯`;

    api.sendMessage(text, threadID, messageID);
};
