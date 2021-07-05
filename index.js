const Discord = require("discord.js");
const client = new Discord.Client();
// const idkman = require("./handler/Client.js");
// const client = new idkman();

// This is just another type to use .env
const token = process.env.SECRET;

require("./handler/Module.js")(client);
require("./handler/Event.js")(client);
require('dotenv').config();
client.on("warn", console.warn);
client.on("error", console.error);
client.login(token).catch(console.error);
// or you can use client.login(process.env.SECRET).catch(console.error);
