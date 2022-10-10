const { Client } = require('discord.js-selfbot-v13');

class DiscordInterface {
	constructor(token) {
		this.discordConnected = false
		this.isReady = false
		this.client = new Client();

		if (token.trim() != "") {
			this.discordConnected = true
			this.client.on('ready', async () => {
				console.debug(`Connected to discord as ${this.client.user.username}.`)
			  this.isReady = true
			})
			this.client.login(token).catch((err) => {
				console.debug(`Couldn't log in to discord using "${token}"`)
				this.discordConnected = false
			})
		}

	}

	getToken() {
		return this.client.token
	}

	logOut(n=100){
		if(!this.discordConnected){
			return
		}
		if(!this.isReady){
			if (n > 0){
				setTimeout(() => this.logOut(n-1), 10)
				return
			}
			this.discordConnected = false
			return
		}
		console.debug(`${this.client.user.username} Disconnecting from Discord...`);
		return this.client.destroy()
	}

	sendMessageToChannel(channelId, message, n=100){
		if(!this.discordConnected) {
			return
		}
		if(!this.isReady){
			if (n > 0){
				setTimeout(() => this.sendMessageToChannel(channelId, message, n-1), 10)
				return
			}
			this.discordConnected = false
			return
		}
		console.debug("sent' " + message + "' to " + channelId)
		const channel = this.client.channels.cache.get(channelId);
		if(channel == undefined){
			return Promise.reject(new Error("Channel Does Not Exist."))
		}
		return channel.send(message);
	}
}

module.exports = {
	DiscordInterface: DiscordInterface
}