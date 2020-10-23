const Discord = require("../main_system").Discord;
const Session = require("../Classes/Session").Session;
const System = require("../main_system").System;

const config = require("../config.json");

function begin(vc, message) {
    if(vc.channelID === undefined || vc.channelID === null) {
        message.channel.send("You are not in a voice channel, so you cannot create a session!");
        return;
    }
    if(System.duplicateSession(vc.channel, System.sessions)) {
        message.channel.send("There is already an active session in this channel. Only the moderator can transfer ownership by using #transfer @USER.");
        return;
    }

    const new_session = new Session(message.author, message.guild, vc.channel);
    System.sessions.push(new_session);
    const embed = new Discord.MessageEmbed()
        .setColor("#00ff08")
        .setTitle("Session Created!")
        .addFields(
            { name: "Moderator:", value: `<@${message.author.id}>` },
            { name: "Channel:", value: vc.channel.name, inline: true },
            { name: "Session:", value: new_session.id, inline: true },
        )
        .setFooter(`ImpostorBot ${config.version}`, "https://lh3.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO=s180-rw");

    message.channel.send(embed);
}

exports.begin = begin;