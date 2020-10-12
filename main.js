const Discord = require("./main_system").Discord;
const client = require("./main_system").client;
const System = require("./main_system").System;

const token = require("./auth.json").token;
const config = require("./config.json");

client.on("ready", function() {
    console.log("There is an Impostor(Bot) among us...");
    client.channels.fetch("760949562197671967")
        .then(channel => channel.send("> There is an Impostor(Bot) among us...\nI am now online."))
        .catch(console.log);
    sessionCollection();
});
client.login(token);

var disabled = false;


const Session = require("./Classes/Session").Session;

client.on("message", function(message) {
    if(message.author.bot) return;                                                      // Ignore bots.
    const p_m = message.content.split(" ");                                             // Split message into words.
    if(message.content[0] !== "#") return;                                              // Check if trigger symbol used. 
    const cmd = p_m[0].substring(1).toLowerCase();                                      // Get command of message.
    const args = p_m.splice(0, 1);                                                      // Get array of words WITHOUT first word (command).
    
    const vc = message.member.voice;
    switch (cmd) {
        case "begin_session":
        case "begin":
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
            break;
        case "transfer":
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
            break;
        case "stop":
            if(vc.channelID === undefined || vc.channelID === null) {
                message.channel.send("You are not in a voice channel, so you cannot transfer a session!");
                return;
            }
            /*
            const stop_embed = new Discord.MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("Session Closed:")
                        .addFields(
                            { name: "Moderator:", value: `<@${message.author.id}>`, inline: true },
                            { name: "New Moderator:", value: `<@${newOwner.id}>`, inline: true },
                            { name: "\u200B", value: "\u200B", inline: true }
                        )
                        .addFields(
                            { name: "Channel:", value: vc.channel.name, inline: true },
                            { name: "Session:", value: transfered_session.id, inline: true},
                            { name: "\u200B", value: "\u200B", inline: true }
                        )
                        .setFooter(`ImpostorBot ${config.version}`, "https://lh3.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO=s180-rw");
            */
            message.channel.send(`Closed ${System.disconnectSessions(message.member)} sessions owned by user <@${message.member.id}>.`);
            break;
        case "sus":
            const ejected = message.mentions.members.first();
            if(!ejected) {
                message.channel.send("Empty accusation.");
                return;
            }
            message.channel.send(`<@${ejected.id}> has been ejected.`);
            break;
        case "session":
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
            break;
        case "pause":
            if(vc.channelID === undefined || vc.channelID === null) {
                message.channel.send("You are not in a voice channel.");
                return;
            }
            const sessionn = System.findSessionById(vc.channelID);
            if(!sessionn) {
                message.channel.send("There is no active session in your channel.");
                return;
            }
            if(System.ownsCurrentSession(vc)) {
                switch (sessionn.state) {
                    case "active":
                        sessionn.pause();
                        message.channel.send("Paused session.");
                        break;
                    case "inactive":
                        sessionn.resume();
                        message.channel.send("Resumed session.");
                        break;
                }
                return;
            }else{
                message.channel.send("You do not own this session!");
                return;
            }
    }
    
});

client.on("voiceStateUpdate", function(oldUser, newUser) {
    switch (System.voiceChange(oldUser, newUser)) {
        case "disconnect":
        case "switched":
            System.disconnectSessions(oldUser, System.sessions);                        // Disconnect all sessions of user.
            break;
        case "self_mute":
            if(System.ownsCurrentSession(oldUser)) {
                System.findSessionById(oldUser.channelID).muteMembers(1);
            }
            break;
        case "self_unmute":
            if(System.ownsCurrentSession(oldUser)) {
                System.findSessionById(oldUser.channelID).muteMembers(0);
            }
            break;
    }

});

function sessionCollection() {
    for(let i = 0; i < System.sessions.length; i++) {
        //console.log(sessions);
        if(System.sessions[i].state === "closed" || System.sessions[i].owner === null) System.sessions.splice(i, 1);
    }
    setTimeout(sessionCollection, 1000);
}