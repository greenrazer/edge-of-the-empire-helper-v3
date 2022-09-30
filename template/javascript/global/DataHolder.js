import {copy, removeItemAll} from "./utils.js"

export class DataHolder {
	SET_CURRENT_CHARACTER = 'setCurrentCharacter'
	ALL_DATA_CHANGED = 'allDataChanged'
	CHARACTER_DELETED = 'characterDeleted'
	CHARACTER_ADDED = 'characterAdded'
	FORCE_UPDATE = 'forceUpdate'

	constructor() {
		this.listeners = {
			listeners: []
		}
		this.allListeners = []
		this.currCharacterIndex = -1

		this.deferredListeners = {
			remove: [],
			add: []
		}
		this.currId = 0;
	}

	getUniqueId() {
		this.currId++
		return this.currId;
	}
	
	setData(data) {
		this.data = data

		this.data["characterEditorInfo"] = []

		for (const char in this.data.characters){
			this.data["characterEditorInfo"].push({
				'unsaved': false,
			})
		}

		this.alertAllListeners(this.ALL_DATA_CHANGED)
	}
	
	get(path) {
		let pathCopy = JSON.parse(JSON.stringify(path))
		let currData = this.data
		while (pathCopy.length > 0) {
			let nextKey = pathCopy.shift()
			if (typeof currData == 'object' && nextKey in currData){
				currData = currData[nextKey]
			}
			else {
				var err = new Error();
				throw `Could not find path: ${path} in data: \n ${err.stack}`
			}
		}
		return currData
	}

	getPathCurrentCharacter(characterPath) {
		if (this.currCharacterIndex < 0) {
			throw "No character currently selected "
		}

		let pathCopy = JSON.parse(JSON.stringify(characterPath))
		let dataPath = ["characters", this.currCharacterIndex].concat(pathCopy)
		
		return this.get(dataPath)
	}

	setCurrCharacterIndex(index) {
		this.currCharacterIndex = index
		this.alertAllListeners(this.SET_CURRENT_CHARACTER)
	}
	
	set(path, value) {
		let pathCopy = JSON.parse(JSON.stringify(path))
		let currData = this.data
		while (pathCopy.length > 1) {
			let nextKey = pathCopy.shift()
			if (nextKey in currData){
				currData = currData[nextKey]
			}
			else {
				throw `Could not find path: ${path} in data`
			}
		}

		let nextKey = pathCopy.shift()
		currData[nextKey] = value

		this.alertListeners(path, value)
	}

	setPathCurrentCharacter(characterPath, value) {
		if (this.currCharacterIndex < 0) {
			throw "No character currently selected "
		}

		let pathCopy = JSON.parse(JSON.stringify(characterPath))
		let dataPath = ["characters", this.currCharacterIndex].concat(pathCopy)
		
		return this.set(dataPath, value)
	}

	has(path){
		try{
			this.get(path)
			return true
		}
		catch (error){
			return false
		}
	}

	push(path, value) {
		let pathCopy = JSON.parse(JSON.stringify(path))
		let currData = this.data
		while (pathCopy.length > 1) {
			let nextKey = pathCopy.shift()
			if (nextKey in currData){
				currData = currData[nextKey]
			}
			else {
				throw `Could not find path: ${path} in data`
			}
		}

		let nextKey = pathCopy.shift()
		currData[nextKey].push(value)

		this.alertListeners(path, value)
	}

	remove(path, at) {
		let pathCopy = JSON.parse(JSON.stringify(path))
		let currData = this.data
		while (pathCopy.length > 1) {
			let nextKey = pathCopy.shift()
			if (nextKey in currData){
				currData = currData[nextKey]
			}
			else {
				throw `Could not find path: ${path} in data`
			}
		}

		let nextKey = pathCopy.shift()
		currData[nextKey].splice(at, 1)

		this.alertListeners(path, null)
	}

	deleteCharacter(id) {
		if (0 <= id && id < this.data["characters"].length){
			this.data["characters"].splice(id, 1)
			this.data["characterEditorInfo"].splice(id,1)
		}

		if (id == this.currCharacterIndex) {
			this.currCharacterIndex = -1
		}
		else if(this.currCharacterIndex != -1 && id > this.currCharacterIndex) {
			this.currCharacterIndex -= 1
		}
		this.alertAllListeners(this.CHARACTER_DELETED)
	}

	randomId(length) {
		let result           = '';
		let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
		let charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	createNewCharacter() {
		let defaultPlayer = copy(this.data["defaultCharacter"])
		defaultPlayer["meta"]["filename"] = this.randomId(50)
		
		let outputFunc = (doesExist) => {
			if (doesExist){
				defaultPlayer["meta"]["filename"] = this.randomId(50)
				window.api.doesCharacterFileNameExist(defaultPlayer).then(outputFunc)
				return
			}
			this.data["characters"].push(defaultPlayer)
			this.data["characterEditorInfo"].push({
				'unsaved': true,
			})
			this.alertAllListeners(this.CHARACTER_ADDED)
		}
		window.api.doesCharacterFileNameExist(defaultPlayer).then(outputFunc)
	}

	addNewCharacter(character) {
		this.data["characters"].push(character)
		this.data["characterEditorInfo"].push({
			'unsaved': true,
		})
		this.alertAllListeners(this.CHARACTER_ADDED)
	}

	alertListeners(path, newValue) {
		this.alerting = true

		let pathCopy = JSON.parse(JSON.stringify(path))
		let currListeners = this.listeners
		for (const listener of currListeners.listeners) {
			listener(path, newValue);
		}

		while (pathCopy.length > 0) {
			let nextKey = pathCopy.shift();
			if (nextKey in currListeners){
				currListeners = currListeners[nextKey];
				for (const listener of currListeners.listeners) {
					listener(path, newValue);
				}
			}
			else {
				break;
			}
		}

		this.alerting = false
		this.handleDeferredListeners()
	}

	alertAllListenersBelow(path) {
		this.alerting = true

		let pathCopy = JSON.parse(JSON.stringify(path))
		let currListeners = this.listeners

		while (pathCopy.length > 0) {
			let nextKey = pathCopy.shift();
			if (nextKey in currListeners){
				currListeners = currListeners[nextKey];
			}
			else {
				break
			}
		}

		let queue = [currListeners]

		while (queue.length > 0) {
			let l = queue.shift()
			for (const listener of l.listeners){
				listener([], this.FORCE_UPDATE)
			}
			for (const key in l) {
				if (key != 'listeners'){
					queue.push(l[key])
				}
			}
		}

		this.alerting = false
		this.handleDeferredListeners()

	}

	handleDeferredListeners() {
		for (const [path, callback] of this.deferredListeners.remove){
			this.removeListener(path, callback)
		}

		for (const [path, callback] of this.deferredListeners.add){
			this.addListener(path, callback)
		}

		this.deferredListeners.add = []
		this.deferredListeners.remove = []
	}

	addListener(path, callback) {
		if (this.alerting) {
			this.deferredListeners.add.push([path, callback])
			return
		}
		let pathCopy = JSON.parse(JSON.stringify(path))
		let currListeners = this.listeners
		while (pathCopy.length > 0) {
			let nextKey = pathCopy.shift()
			if (!(nextKey in currListeners)){
				currListeners[nextKey] = {}
				currListeners[nextKey].listeners = []
			}
			currListeners = currListeners[nextKey]
		}

		if (!currListeners.hasOwnProperty("listeners")){
			currListeners.listeners = []
		}
		currListeners.listeners.push(callback)
		this.allListeners.push(callback)
	}

	addListenerCurrentCharacter(characterPath, callback) {
		if (this.currCharacterIndex < 0) {
			throw "No character currently selected "
		}

		let pathCopy = JSON.parse(JSON.stringify(characterPath))
		let dataPath = ["characters", this.currCharacterIndex].concat(pathCopy)
		
		return this.addListener(dataPath, callback)
	}

	removeListener(path, callback) {
		if (this.alerting) {
			this.deferredListeners.remove.push([path, callback])
			return
		}
		let pathCopy = JSON.parse(JSON.stringify(path))
		let currListeners = this.listeners
		while (pathCopy.length > 0) {
			let nextKey = pathCopy.shift()
			if (nextKey in currListeners){
				currListeners = currListeners[nextKey]
			}
			else {
				return false
			}
		}

		removeItemAll(currListeners.listeners, callback)
		removeItemAll(this.allListeners, callback)
		return true
	}

	removeListenerCurrentCharacter(characterPath, callback) {
		if (this.currCharacterIndex < 0) {
			throw "No character currently selected "
		}

		let pathCopy = JSON.parse(JSON.stringify(characterPath))
		let dataPath = ["characters", this.currCharacterIndex].concat(pathCopy)
		
		return this.removeListener(dataPath, callback)
	}

	alertAllListeners(eventName){
		this.alerting = true
		
		for(const listener of this.allListeners){
			listener([], eventName)
		}

		this.alerting = false
		this.handleDeferredListeners()
	}
}