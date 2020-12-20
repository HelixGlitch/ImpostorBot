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

var disabled = true;


const Session = require("./Classes/Session").Session;

client.on("message", function(message) {
    if(message.author.bot) return;                                                      // Ignore bots.
    const p_m = message.content.split(" ");                                             // Split message into words.
    if(message.content[0] !== "#") return;                                              // Check if trigger symbol used. 
    const cmd = p_m[0].substring(1).toLowerCase();                                      // Get command of message.
    const args = p_m.slice(1);                                                      // Get array of words EXCLUDING first word (command).
    if(disabled && !System.isAdmin(message.author.id)) return;

    const vc = message.member.voice;

    try {
        require(`./Commands/${cmd}.js`).run(vc, message);
    }
    catch(err) {
        if(err.code === "MODULE_NOT_FOUND") message.channel.send(`"${cmd}" is not a valid command!`);
    }
    
});

client.on("voiceStateUpdate", function(oldUser, newUser) {
    const sesh = System.findSessionById(oldUser.channelID);
    switch (System.voiceChange(oldUser, newUser)) {
        case "disconnect":
        case "switched":
            if(System.ownsCurrentSession(oldUser)) {
                sesh.muteMembers(0);
            }
            System.disconnectSessions(oldUser, System.sessions);                        // Disconnect all sessions of user.
            break;
        case "self_mute":
            if(System.ownsCurrentSession(oldUser)) {
                sesh.muteMembers(1);
            }
            break;
        case "self_unmute":
            if(System.ownsCurrentSession(oldUser)) {
                sesh.muteMembers(0);
            }
            break;
        case "server_unmute":
            if(!System.findSessionById(oldUser.channelID)) return;
            if(oldUser.guild.members.resolve(sesh.owner) === null) return;
            if(oldUser.guild.members.resolve(sesh.owner).voice.selfMute === true) {
                oldUser.setMute(1)
                    .catch(console.log)
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