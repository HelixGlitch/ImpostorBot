const Discord = require("../main_system").Discord;
const Session = require("../Classes/Session").Session;
const System = require("../main_system").System;

const config = require("../config.json");

function stop(vc, message) {
    if(vc.channelID === undefined || vc.channelID === null) {
        message.channel.send("You are not in a voice channel, so you do not own any sessions.");
        return;
    }
    const stopped_session = System.findSessionById(vc.channelID); 
    if(stopped_session.owner === message.author.id) {
        const stop_embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Session Closed:")
        .addFields(
            { name: "Moderator:", value: `<@${stopped_session.owner}>`, inline: true },
            { name: "Stopped by:", value: `<@${message.author.id}>`, inline: true },
            { name: "\u200B", value: "\u200B", inline: true }
        )
        .addFields(
            { name: "Channel:", value: vc.channel.name, inline: true },
            { name: "Session:", value: stopped_session.id, inline: true},
            { name: "\u200B", value: "\u200B", inline: true }
        )
        .setFooter(`ImpostorBot ${config.version}`, "https://lh3.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO=s180-rw");
        stopped_session.end();
        message.channel.send(stop_embed);
        return;
    }else{
        message.channel.send("You do not own the session.");
        return;
    }
}
exports.run = stop;