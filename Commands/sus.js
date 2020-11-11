const Discord = require("../main_system").Discord;
const Session = require("../Classes/Session").Session;
const System = require("../main_system").System;

const config = require("../config.json");

function sus(vc, message) {
    const ejected = message.mentions.members.first();
    if(!ejected) {
        message.channel.send("Empty accusation.");
        return;
    }
    message.channel.send(`<@${ejected.id}> has been ejected.`);
}
exports.run = sus;