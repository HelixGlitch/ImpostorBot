const Discord = require("../main_system").Discord;
const Session = require("../Classes/Session").Session;
const System = require("../main_system").System;

const config = require("../config.json");

function session(vc, message) {
    if(vc.channelID === undefined || vc.channelID === null) {
        message.channel.send("You are not in a voice channel.");
        return;
    }
    const session = System.findSessionById(vc.channelID);
    if(!session) {
        message.channel.send("There is no active session in your channel.");
        return;
    }
    const information_embed = new Discord.MessageEmbed()
        .setColor("#00e1ff")
        .setTitle("Session Information:")
        .addFields(
            { name: "Moderator:", value: `<@${session.owner}>` },
            { name: "Channel:", value: session.channel.name, inline: true },
            { name: "Session:", value: session.id, inline: true },
            { name: "Status:", value: session.state}
        )
        .setFooter(`ImpostorBot ${config.version}`, "https://lh3.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO=s180-rw");

    message.channel.send(information_embed);
}
exports.run = session;