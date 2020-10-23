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
            require("./Commands/begin.js").begin(vc, message);
            break;
        case "transfer":
            require("./Commands/transfer.js").transfer(vc, message);
            break;
        case "stop":
            require("./Commands/stop.js").stop(vc, message);
            break;
        case "sus":
            require("./Commands/sus.js").sus(vc, message);
            return;
        case "session":
            require("./Commands/session.js").session(vc, message);
            break;
        case "pause":
            require("./Commands/pause.js").pause(vc, message);
            break;
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