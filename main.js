const {app, protocol, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs');
const APP_ROOT_PATH = app.getPath('userData')

const { DiscordInterface } = require('./DiscordInterface.js')

var config;
var discordInterface;

function init(){
	let configPath = path.join(APP_ROOT_PATH, 'config.json')

	if (!fs.existsSync(configPath)){
		config = {
			"defaultCharacterPath": {
				"value": path.join(__dirname, "defaultCharacter.json"),
				"UIType": "path"
			},
			"characterSavedPath":{
				"value": path.join(APP_ROOT_PATH, "saved_characters"),
				"UIType": "path"
			},
			"discordToken": {
				"value": "",
				"UIType": "string"
			}
		}
    writeJSONToDisk(configPath, config)
	}
	else {
		config = filenameToJson(configPath)
	}

	if (!fs.existsSync(config["characterSavedPath"]["value"])){
		fs.mkdirSync(config["characterSavedPath"]["value"]);
	}

	discordInterface = new DiscordInterface(config['discordToken']["value"])
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
		icon: path.join(__dirname, "images/EOTEAppIcon.ico")
  })
	
	mainWindow.setMenuBarVisibility(false)
	mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, 'template/main.html'))
	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	})
}

app.whenReady().then(() => {
	protocol.interceptFileProtocol('static-image', (request, callback) => {
    const url = request.url.substr(15)    /* all urls start with 'file://' */
    callback({ path: path.normalize(`${__dirname}/${url}`)})
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })
	
	init()
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
		discordInterface = new DiscordInterface(globalSettings["discordToken"]["value"])
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

ipcMain.handle("importCharacter", (event, contents) => {
	let result = chooseFilePath([
		{ name: "json", extensions: ["json"] }
	])
	if (!result){
		throw "File Not Specified."
	}
	return filenameToJson(result)
})

ipcMain.handle("chooseFilePath", (event, contents) => {
	let result = chooseFilePath([
		{ name: "json", extensions: ["json"] }
	])

	return result
})

ipcMain.handle("exportCharacter", (event, contents) => {
	let result = dialog.showSaveDialogSync({
		defaultPath: `~/${contents["meta"]["filename"]}.json`,
    filters: [{ name: "json", extensions: ["json"] }]
  });

	contents["meta"]["filename"] = result.replace(/^.*[\\\/]/, '')
	let pos = contents["meta"]["filename"].lastIndexOf('.');
	contents["meta"]["filename"] = contents["meta"]["filename"].substring(0,pos);

	writeJSONToDisk(result, contents)
})

ipcMain.handle("doesCharacterFileNameExist", (event, character) => {
	return fs.existsSync(path.join(config["characterSavedPath"]["value"],`${character["meta"]["filename"]}.json`))
})


function chooseFilePath(filters) {
	let result = dialog.showOpenDialogSync({
    properties: ["openFile"],
    filters: filters
  });

	return result ? result[0] : result
}

function getDefaultCharacterFromDisk() {
	if (!fs.existsSync(config["defaultCharacterPath"]["value"])){
		return null
	}
	return filenameToJson(config["defaultCharacterPath"]["value"])
}

function getCharactersFromDisk() {
	let characterFilenames = getFolderJSONFilenames(config["characterSavedPath"]["value"]);
	let characters = filenamesToJson(characterFilenames)
	return characters	
}

function writeCharacterToDisk(character) {
	writeJSONToDisk(path.join(config["characterSavedPath"]["value"],`${character["meta"]["filename"]}.json`), character)
}

function deleteCharacterFromDisk(character) {
	fs.unlinkSync(path.join(config["characterSavedPath"]["value"],`${character["meta"]["filename"]}.json`))
}

function getGlobalSettingsFromDisk() {
	return filenameToJson(path.join(APP_ROOT_PATH, 'config.json'))	
}

function writeGlobalSettingstoDisk(globalSettings) {
	config = globalSettings
	writeJSONToDisk(path.join(APP_ROOT_PATH, 'config.json'), globalSettings)
}

function getFolderJSONFilenames(folder){
	if (!fs.existsSync(folder)){
		return []
	}
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