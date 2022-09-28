const {app, protocol, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs');

const { DiscordInterface } = require('./DiscordInterface.js')

let config = getGlobalSettingsFromDisk('./config.json');
let discordInterface = new DiscordInterface(config['discordToken'])

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('template/main.html')
	mainWindow.on("ready-to-show", mainWindow.show)
}

app.whenReady().then(() => {
	protocol.interceptFileProtocol('static-image', (request, callback) => {
    const url = request.url.substr(15)    /* all urls start with 'file://' */
    callback({ path: path.normalize(`${__dirname}/${url}`)})
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })
	
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})





ipcMain.handle("getAllData", async (event) => {
	return {
		"characters": await getCharactersFromDisk(),
		"defaultCharacter": await getDefaultCharacterFromDisk(),
	}
})

ipcMain.handle("saveCharacter", (event, character) => {
	return writeCharacterToDisk(character)
})

ipcMain.handle("deleteCharacter", (event, character) => {
	return deleteCharacterFromDisk(character)
})

ipcMain.handle("getGlobalSettings", (event) => {
	return getGlobalSettingsFromDisk()
})

ipcMain.handle("setGlobalSettings", (event, globalSettings) => {
	if (discordInterface.getToken() != globalSettings["discordToken"]){
		discordInterface.logOut()
		discordInterface = new DiscordInterface(globalSettings["discordToken"])
	}
	return writeGlobalSettingstoDisk(globalSettings)
})

ipcMain.handle("sendMessageDiscord", (event, channel, message) => {
	if (!discordInterface.discordConnected){
		throw new Error("Discord is not connected.")
	}
	let promise =  discordInterface.sendMessageToChannel(channel, message);
	return promise.then(() => true).catch((err) => {
		throw new Error(err.message)
	})
})

ipcMain.handle("chooseImage", (event) => {
	let result = dialog.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png","jpg","jpeg"] }]
  });

	const base64 = fs.readFileSync(result[0]).toString('base64');
	let extname = path.extname(result[0]).substring(1)
	return `data:image/${extname};base64,${base64}`
})

ipcMain.handle("importJson", (event, contents) => {
	let result = dialog.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "json", extensions: ["json"] }]
  });

	return filenameToJson(result[0])
})

ipcMain.handle("exportJson", (event, contents) => {
	let result = dialog.showSaveDialogSync({
		defaultPath: `~/${contents["meta"]["filename"]}.json`,
    filters: [{ name: "Json Object", extensions: ["json"] }]
  });

	writeJSONToDisk(result, contents)
})


function getDefaultCharacterFromDisk() {
	return filenameToJson(config["defaultCharacterFilename"])
}

function getCharactersFromDisk() {
	let characterFilenames = getFolderJSONFilenames(config["characterSavedFolder"]);
	let characters = filenamesToJson(characterFilenames)
	return characters	
}

function writeCharacterToDisk(character) {
	writeJSONToDisk(`${config["characterSavedFolder"]}/${character["meta"]["filename"]}.json`, character)
}

function deleteCharacterFromDisk(character) {
	fs.unlinkSync(`${config["characterSavedFolder"]}/${character["meta"]["filename"]}.json`)
}

function getGlobalSettingsFromDisk() {
	return filenameToJson('./config.json')	
}

function writeGlobalSettingstoDisk(globalSettings) {
	config = globalSettings
	writeJSONToDisk('./config.json', globalSettings)
}

function getFolderJSONFilenames(folder){
	let files = fs.readdirSync(folder)
		.map(file => folder + "/" + file)
		.filter(file => fs.lstatSync(file).isFile() && path.extname(file) == '.json');
	return files
}

function filenamesToJson(filenames){
	let jsonArr = filenames.map(file => {
		return filenameToJson(file);
	})
	return jsonArr;
}

function filenameToJson(filename) {
	let jsonData = fs.readFileSync(filename);
	return JSON.parse(jsonData);
}

function writeJSONToDisk(filename, jsonObj) {
	var characterstring = JSON.stringify(jsonObj)
	fs.writeFileSync(filename, characterstring, 'utf8');
}