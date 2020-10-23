const Discord = require("../main_system").Discord;
const Session = require("../Classes/Session").Session;
const System = require("../main_system").System;

const config = require("../config.json");

function transfer(vc, message) {
    if(vc.channelID === undefined || vc.channelID === null) {
        message.channel.send("You are not in a voice channel, so you cannot transfer a session!");
        return;
    }
    const newOwner = message.mentions.members.first();
    if(!newOwner) {
        message.channel.send("You have not mentioned a member!");
        return;
    }
    const current_session = System.ownsCurrentSession(message.member.voice);
    if(message.member.voice.channelID === newOwner.voice.channelID) {
        if(current_session) {
            const transfered_session = System.findSessionById(message.member.voice.channelID);
            transfered_session.changeOwner(newOwner.id);
            const transfer_embed = new Discord.MessageEmbed()
                .setColor("#f2ff00")
                .setTitle("Transfer Complete:")
                .addFields(
                    { name: "Old Moderator:", value: `<@${message.author.id}>`, inline: true },
                    { name: "New Moderator:", value: `<@${newOwner.id}>`, inline: true },
                    { name: "\u200B", value: "\u200B", inline: true }
                )
                .addFields(
                    { name: "Channel:", value: vc.channel.name, inline: true },
                    { name: "Session:", value: transfered_session.id, inline: true},
                    { name: "\u200B", value: "\u200B", inline: true }
                )
                .setFooter(`ImpostorBot ${config.version}`, "https://lh3.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO=s180-rw");

            message.channel.send(transfer_embed);
            return;                    
        }else{
            if(current_session === undefined) {
                message.channel.send("There is no active session in this channel.");
            }else{
                message.channel.send("You do not own this session!")
            }
            return;
        }
    }else{
        message.channel.send("This user is not in your channel!")
    }
}
exports.transfer = transfer;