const { Client } = require('discord.js-selfbot-v13');

class DiscordInterface {
	constructor(token, onLoginError=null) {
		this.onLoginError = onLoginError
		
		this.discordConnected = false
		this.isReady = false
		this.client = new Client();

		if (token.trim() != "") {
			this.discordConnected = true
			this.client.on('ready', async () => {
				console.debug(`Connected to discord as ${this.client.user.username}.`)
			  this.isReady = true
			})
			this.client.login(token).catch(this.onLoginError)
		}

	}

	getToken() {
		return this.client.token
	}

	logOut(){
		if(!this.discordConnected){
			return
		}
		if(!this.isReady){
			setTimeout(() => this.logOut(), 10)
			return
		}
		console.debug(`${this.client.user.username} Disconnecting from Discord...`);
		return this.client.destroy()
	}

	sendMessageToChannel(channelId, message){
		if(!this.discordConnected) {
			return
		}
		if(!this.isReady){
			setTimeout(() => this.sendMessageToChannel(channelId, message), 10)
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