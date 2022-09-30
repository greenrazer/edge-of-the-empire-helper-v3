const { contextBridge, ipcRenderer } = require('electron');



const API = {
	getAllData: () => ipcRenderer.invoke('getAllData'),
	saveCharacter: (characterData) => ipcRenderer.invoke('saveCharacter', characterData),
	deleteCharacter: (characterData) => ipcRenderer.invoke('deleteCharacter', characterData),
	getGlobalSettings: () => ipcRenderer.invoke('getGlobalSettings'),
	setGlobalSettings: (settings) => ipcRenderer.invoke('setGlobalSettings', settings),
	discordSendMessageToChannel: (channel, message) => ipcRenderer.invoke('sendMessageDiscord', channel, message),
	chooseImage: () => ipcRenderer.invoke('chooseImage'),
	exportJson: (contents) => ipcRenderer.invoke('exportJson', contents),
	importJson: () => ipcRenderer.invoke('importJson'),
	chooseFilePath: () => ipcRenderer.invoke('chooseFilePath')
}

contextBridge.exposeInMainWorld("api", API);
