const { contextBridge, ipcRenderer } = require('electron');



const API = {
	getAllData: () => ipcRenderer.invoke('getAllData'),
	doesCharacterFileNameExist: (characterData) => ipcRenderer.invoke('doesCharacterFileNameExist', characterData),
	saveCharacter: (characterData) => ipcRenderer.invoke('saveCharacter', characterData),
	deleteCharacter: (characterData) => ipcRenderer.invoke('deleteCharacter', characterData),
	getGlobalSettings: () => ipcRenderer.invoke('getGlobalSettings'),
	setGlobalSettings: (settings) => ipcRenderer.invoke('setGlobalSettings', settings),
	discordSendMessageToChannel: (channel, message) => ipcRenderer.invoke('sendMessageDiscord', channel, message),
	chooseImage: () => ipcRenderer.invoke('chooseImage'),
	exportJson: (contents) => ipcRenderer.invoke('exportCharacter', contents),
	importJson: () => ipcRenderer.invoke('importCharacter'),
	chooseFilePath: () => ipcRenderer.invoke('chooseFilePath'),
}

contextBridge.exposeInMainWorld("api", API);
