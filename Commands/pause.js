const Discord = require("../main_system").Discord;
const Session = require("../Classes/Session").Session;
const System = require("../main_system").System;

const config = require("../config.json");

function pause(vc, message) {
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
exports.run = pause;