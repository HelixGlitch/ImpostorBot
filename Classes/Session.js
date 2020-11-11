const client = require("../main_system").client;

function rand_id() {
    const pool = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for(let i = 0; i < 36; i++) {
        result += pool[Math.floor(Math.random()*36)];
    }
    return result;
}

class Session {
    constructor(owner /*User*/, guild, channel) {
        this.owner = owner.id;
        this.guild = guild.id;
        this.channel = channel;
        this.id = rand_id();
        this.state = "active";
    }
    changeOwner(owner) {
        this.owner = owner;
    }
    pause() {
        this.state = "inactive";
    }
    resume() {
        this.state = "active";
    }
    end() {
        this.owner = null;
        this.state = "closed";
    }
    muteMembers(mute) {
        // mute = 0 - self unmute
        // mute = 1 - self mute
        if(this.state !== "active") return;
        const owner = this.owner;
        client.channels.fetch(this.channel.id)
            .then
            (
                voiceChannel => {
                    voiceChannel.members.forEach(async function(guildMember) {
                        //console.log(owner, guildMember.id, typeof(guildMember.id), typeof(owner), guildMember.id != owner);
                            if((mute ? guildMember.voice.serverMute === false : guildMember.voice.serverMute === true) && guildMember.id != owner /*this has to be == instead of === for some reason*/) {
                                guildMember.voice.setMute(mute ? true : false)
                            }
                    });
                }
            )
            .catch(console.log)
    }
}

exports.Session = Session;