class System {
    constructor(client) {
        this.client = client;
        this.sessions = [];
    }
    getChannel(id) {
        // Fetch channel from System's attached client. 
        this.client.channels.fetch(id)
            .then(channel => {return channel;})         // If successful, return channel.
            .catch(console.error)                       // If not, print error in console.
    }
    findSessionById(id) {
        for(const sesh of this.sessions) {
            if(sesh.channel.id === id) return sesh;
        }
        return false;
    }
    duplicateSession(channel) {
        // Check if session already exists in this channel.
        for(const sesh of this.sessions) {
            if(sesh.channel.id === channel.id) {
                return true;
            }
        }
        return false;
    }
    disconnectSessions(user) {
        let deleted = 0;
        for(const sesh of this.sessions) {
            if(sesh.owner === user.id) {
                sesh.end();
                deleted ++;
            }
        }
        return deleted;
    }
    ownsSession(user) {
        let owned_sessions = [];
        for(const sesh of this.sessions) {
            if(sesh.owner === user.id) {
                owned_sessions.push(sesh);
            }
        }
        return owned_sessions;
    }
    ownsCurrentSession(user) {
        //console.log(user);
        const current_sesh = this.findSessionById(user.channelID);
        if(!current_sesh) return undefined;
        if(current_sesh.owner === user.id) return true;
        return false;
    }
    voiceChange(oldUser, newUser) {
        if(oldUser && !newUser) return "disconnect";
        if(!oldUser && newUser) return "connect";
        if(oldUser && newUser) {
            if(oldUser.channelID !== newUser.channelID) return "switched";
            if(oldUser.selfMute === false && newUser.selfMute === true) return "self_mute";
            if(oldUser.selfMute === true && newUser.selfMute === false) return "self_unmute";
            return "unknown";
        }
    }
}

exports.System = System;