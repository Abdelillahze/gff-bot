const fs = require("fs");

const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
<<<<<<< HEAD
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
=======
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
>>>>>>> d1dc8c5 (ahla)
  ],
});

const { TOKEN } = process.env;

fs.readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// client.on(Events.MessageCreate, () => {
//   console.log("ahla");
// });

client.login(TOKEN);
