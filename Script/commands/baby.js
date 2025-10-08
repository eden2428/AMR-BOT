const axios = require("axios");

const simsim = "https://simsimi.cyberbot.top";

module.exports.config = {
  name: "baby",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "ULLASH",
  description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
  commandCategory: "simsim",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const query = args.join(" ").toLowerCase();

    if (!query) {
      const ran = ["Bolo baby", "hum"];
      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      });
    }

    if (["remove", "rm"].includes(args[0])) {
      const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage(" | Use: remove [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 5000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      const res = await axios.get(`${simsim}/list`, { timeout: 5000 });
      if (res.data.code === 200) {
        return api.sendMessage(
          `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\n☠︎︎ Developer: ${res.data.author}`,
          event.threadID,
          event.messageID
        );
      } else {
        return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === "edit") {
      const parts = query.replace("edit ", "").split(" - ");
      if (parts.length < 3)
        return api.sendMessage(" | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);
      const [ask, oldReply, newReply] = parts;
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`, { timeout: 5000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "teach") {
      const parts = query.replace("teach ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage(" | Use: teach [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`, { timeout: 5000 });
      return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
    }

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 5000 });
    const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
    
    for (const reply of responses) {
      if (!reply) continue;
      await new Promise((resolve) => {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err && !global.client.handleReply.find(r => r.messageID === info.messageID)) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }

  } catch (err) {
    console.error(err);
    return api.sendMessage(`| Error in baby command: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users }) {
  try {
    const senderName = await Users.getNameUser(event.senderID);
    const replyText = event.body ? event.body.toLowerCase() : "";
    if (!replyText) return;

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 5000 });
    const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

    for (const reply of responses) {
      if (!reply) continue;
      await new Promise((resolve) => {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err && !global.client.handleReply.find(r => r.messageID === info.messageID)) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(`| Error in handleReply: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;

    const triggers = ["baby", "bot", "bby", "jannu", "xan", "বেপি", "বট", "বেবি", "জান"];

    if (triggers.includes(raw)) {
      const greetings = [
        "babu khuda lagse🥺",
        "Hop beda😾,Boss বল boss😼",  
        "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",  
        "🐒🐒🐒",
        "bye",
        "BOSS ER ID https://m.me/ibonex.eden",
        "mb ney bye",
        "meww",
        "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",  
        "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
        "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏",
        "গোসল করে আসো যাও😑😩",
        "অ্যাসলামওয়ালিকুম",
        "কেমন আসো",
        "বলেন sir__😌",
        "বলেন ম্যাডাম__😌",
        "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
        "🙂🙂🙂",
        "এটায় দেখার বাকি সিলো_🙂🙂🙂",
        "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
        "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂",
        "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
        "𝗕𝗯𝘆 না জানু, বল 😌",
        "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒",
        "__বেশি বেবি বললে কামুর দিমু 🤭🤭",
        "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
        "bolo baby😒",
        "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
        "আমি তো অন্ধ কিছু দেখি না🐸 😎",
        "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣",
        "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!🤔_নাহ মানে চুরি করতাম 😞😘",
        "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘",
        "দূরে যা, তোর কোনো কাজ নাই, শুধু 𝗯𝗯𝘆 𝗯𝗯𝘆 করিস  😉😋🤣",
        "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗯𝘆 𝗯𝗯𝘆 করিস 😾",
        "তোরা যে হারে 𝗕𝗯𝘆 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑",
        "আজব তো__😒",
        "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
        "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
        "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, EDEN, EDEN ও তো করতে পারো😑?",
        "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
        "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
        "হটাৎ আমাকে মনে পড়লো 🙄",
        "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
        "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
        "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
        "খাওয়া দাওয়া করসো 🙄",
        "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
        "আরে আমি মজা করার mood এ নাই😒",
        "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
        "আরে Bolo আমার জান, কেমন আসো? 😚",
        "একটা BF খুঁজে দাও 😿",
        "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗",
        "oi mama ar dakis na pilis 😿",
        "🐤🐤",
        "__ভালো হয়ে  যাও 😑😒",
        "এমবি কিনে দাও না_🥺🥺",
        "ওই মামা_আর ডাকিস না প্লিজ",
        "৩২ তারিখ আমার বিয়ে 🐤",
        "হা বলো😒,কি করতে পারি😐😑?",
        "বলো ফুলটুশি_😘",
        "amr JaNu lagbe,Tumi ki single aso?",
        "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
        "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
        "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
        "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
        "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
        "ভুলে জাও আমাকে 😞😞",
        "দেখা হলে কাঠগোলাপ দিও..🤗",
        "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
        "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
        "বলো কি করতে পারি তোমার জন্য 😚",
        "কথা দেও আমাকে পটাবা...!! 😌",
        "বার বার Disturb করেছিস কোনো 😾, আমার জানু এর সাথে ব্যাস্ত আসি 😋",
        "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
        "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
        "ওই তুমি single না?🫵🤨 😑😒",
        "বলো জানু 😒",
        "Meow🐤",     
        "আর কত বার ডাকবা ,শুনছি তো 🤷🏻‍♀",
        "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
        "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
        "আজকে আমার mন ভালো নেই 🙉",
        "আমি হাজারো মশার Crush😓",
        "প্রেম করার বয়সে লেখাপড়া করতেছি, রেজাল্ট তো খা/রা'প হবেই.!🙂",
        "আমার ইয়ারফোন চু'রি হয়ে গিয়েছে!! কিন্তু চোর'কে গা-লি দিলে আমার বন্ধু রেগে যায়!'🙂",
        "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
        "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
        "মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚"
      ];
      const randomReply = greetings[Math.floor(Math.random() * greetings.length)];
      const mention = {
        body: `@${senderName} ${randomReply}`,
        mentions: [{ tag: `@${senderName}`, id: senderID }]
      };

      return api.sendMessage(mention, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    const triggerRegex = new RegExp(`^(${triggers.join("|")})\\s+`, "i");
    if (triggerRegex.test(raw)) {
      const query = raw.replace(triggerRegex, "").trim();
      if (!query) return;

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 5000 });
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      for (const reply of responses) {
        if (!reply) continue;
        await new Promise((resolve) => {
          api.sendMessage(reply, event.threadID, (err, info) => {
            if (!err && !global.client.handleReply.find(r => r.messageID === info.messageID)) {
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "simsimi"
              });
            }
            resolve();
          }, event.messageID);
        });
      }
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(`| Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
  }
};
