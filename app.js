const fs = require("fs");

const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();
const client = new Client({
  partials: ["CHANNEL", "MESSAGE"],
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

const { TOKEN } = process.env;

fs.readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// client.on(Events.MessageCreate, (message) => {
//   console.log("ahla");
// });

client.login(TOKEN);
