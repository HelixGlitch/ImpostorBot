const Discord = require("discord.js");
const client = new Discord.Client();
const System = new (require("./Classes/System").System)(client);
exports.Discord = Discord;
exports.client = client;
exports.System = System;