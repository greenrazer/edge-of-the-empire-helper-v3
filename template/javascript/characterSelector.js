import { GlobalSettings } from "./full_viewport_boxes/GlobalSettings.js";
import { equalArray } from "./global/utils.js";

export class CharacterSelectorHolder extends React.Component {
	constructor(props) {
		super(props);

		this.dataPath = ["characters"]

		let initCharacters = window.data.get(this.dataPath)
		this.state = { 
			charactersLen: initCharacters.length,
			showGlobalSettings:false,
		};
		
		this.dataChangeHandler = (path, newValue) => {
			this.setState({charactersLen: window.data.get(this.dataPath).length})
		};
		window.data.addListener(this.dataPath, this.dataChangeHandler)

		this.handleNewCharacter = this.handleNewCharacter.bind(this)
		this.handleImport = this.handleImport.bind(this)
		this.showGlobalSettings = this.showGlobalSettings.bind(this)
		this.hideGlobalSettings = this.hideGlobalSettings.bind(this)
	}

	handleNewCharacter(event) {
		window.data.createNewCharacter()
	}

	handleImport(event) {
		window.api.importJson().then((character) => {
			window.data.addNewCharacter(character)
		})
	}

	showGlobalSettings(event) {
		this.setState({
			showGlobalSettings:true,
		})
	}

	hideGlobalSettings(){
		this.setState({
			showGlobalSettings:false,
		})
	}

	render() {
		let characters = []

		for (let i = 0; i < this.state.charactersLen; i++) {
			characters.push(
				React.createElement(CharacterSelector, {characterId: i, key:i})
			)
		}
		return React.createElement('div', {id: 'left'}, 
			this.state.showGlobalSettings ? React.createElement(GlobalSettings, {removeSelf: this.hideGlobalSettings}) : null,
			React.createElement('div', {id: 'character-selector-holder'},
				React.createElement('button', {onClick: this.handleNewCharacter, title:"Create New Character"},  React.createElement('i', {className:"mf mf-plus"})), 
				React.createElement('button', {onClick: this.showGlobalSettings, title:"Global Settings"}, React.createElement('i', {className:"mf mf-gear"})),
				React.createElement('button', {onClick:this.handleImport, title:"Import File"}, React.createElement('i', {className:"mf mf-download"})),
				React.createElement('div', {id:"character-selector-holder-inner"}, characters)
			)
		)
	}
}

class CharacterSelector extends React.Component {
	constructor(props) {
		super(props);

		this.dataPath = ["characters", this.props.characterId, "base"]
		this.dataPathImage = this.dataPath.concat(["image"])
		this.dataPathName =  this.dataPath.concat(["name"])
		this.dataPathPlayerName = this.dataPath.concat(["playerName"])
		this.dataPathSpecies = this.dataPath.concat(["species"])
		
		this.dataPathUnsaved = ["characterEditorInfo", this.props.characterId, 'unsaved']

		let initImage= window.data.get(this.dataPathImage)
		let initName = window.data.get(this.dataPathName)
		let initPlayerName = window.data.get(this.dataPathPlayerName)
		let initSpecies = window.data.get(this.dataPathSpecies)
		let initUnsaved = window.data.get(this.dataPathUnsaved)
		this.state = { 
			image: initImage,
			name: initName,
			playerName: initPlayerName,
			species: initSpecies,
			unsavedChanges: initUnsaved,
			saving:false,
		};
		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.CHARACTER_DELETED) {
					if (window.data.has(this.dataPath)){
						this.setState({
							image: window.data.get(this.dataPathImage),
							name: window.data.get(this.dataPathName),
							playerName: window.data.get(this.dataPathPlayerName),
							species: window.data.get(this.dataPathSpecies),
							unsavedChanges: window.data.get(this.dataPathUnsaved)
						})
					}
				}
			}
			else if (equalArray(path, this.dataPathName)) {
				this.setState({name: newValue})
			}
			else if (equalArray(path, this.dataPathPlayerName)) {
				this.setState({playerName: newValue})
			}
			else if (equalArray(path, this.dataPathSpecies)) {
				this.setState({species: newValue})
			}
			else if (equalArray(path, this.dataPathImage)) {
				this.setState({image: newValue})
			}
			else if (equalArray(path, this.dataPathUnsaved)){
				this.setState({
					unsavedChanges: newValue
				})
			}
		};

		window.data.addListener(this.dataPathImage, this.dataChangeHandler)
		window.data.addListener(this.dataPathName, this.dataChangeHandler)
		window.data.addListener(this.dataPathPlayerName, this.dataChangeHandler)
		window.data.addListener(this.dataPathSpecies, this.dataChangeHandler)
		window.data.addListener(this.dataPathUnsaved, this.dataChangeHandler)

		this.unsavedListener = (path, newValue) => {
			if(path.length > 0){
				window.data.set(["characterEditorInfo", this.props.characterId, 'unsaved'], true)
			}
		}

		window.data.addListener(["characters", this.props.characterId], this.unsavedListener)
		
		this.handleOpen = this.handleOpen.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleFile = this.handleFile.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	componentWillUnmount() {
		window.data.removeListener(["characters", this.props.characterId], this.unsavedListener)

		window.data.removeListener(this.dataPathImage, this.dataChangeHandler)
		window.data.removeListener(this.dataPathName, this.dataChangeHandler)
		window.data.removeListener(this.dataPathPlayerName, this.dataChangeHandler)
		window.data.removeListener(this.dataPathSpecies, this.dataChangeHandler)
		window.data.removeListener(this.dataPathUnsaved, this.dataChangeHandler)
	}

	handleOpen(event) {
		window.data.setCurrCharacterIndex(this.props.characterId)
		var myEle = document.getElementById("pane-selector-0");
    if(myEle){
      myEle.click()
    }
	}

	handleDelete(event) {
		if (window.confirm("Are you sure you want to delete this character? (This is irreversible).")) {
			window.api.deleteCharacter(window.data.get(["characters", this.props.characterId]))
			window.data.deleteCharacter(this.props.characterId)
		}
	}

	handleFile(event){
		window.api.chooseImage().then((imageBase64) => {
			window.data.set(["characters", this.props.characterId, "base", "image"], imageBase64)
		})
	}

	handleSave(event) {
		if ( window.data.get(["characters", this.props.characterId, "meta", "filename"]) == "" ){
			alert("Must have filename in order to save.")
			return
		}
		this.setState({
			saving: true
		})
		window.api.saveCharacter(window.data.get(["characters", this.props.characterId])).then((value) => {
			setTimeout(() => {
				this.setState({
					unsavedChanges:false,
					saving:false
				})
				window.data.set(['characterEditorInfo', this.props.characterId, 'unsaved'], false)
			}, 1000)
		});
	}

	render() {
		return React.createElement('div', {className:"character-selector"},
			React.createElement('div', {className:"character-selector-top"},
				React.createElement('div', {className:"character-selector-image", onClick:this.handleFile},
					React.createElement('img', {src:this.state.image}),
				),
				React.createElement('div', {className:"character-selector-inner"},
					React.createElement('div', null,
						React.createElement('span', null, "Name: "),
						React.createElement('span', null, this.state.name)
					),
					React.createElement('div', null,
						React.createElement('span', null, "Player Name: "),
						React.createElement('span', null, this.state.playerName)
					),
					React.createElement('div', null,
						React.createElement('span', null, "Species: "),
						React.createElement('span', null, this.state.species)
					),
					React.createElement('div', null,
						React.createElement('span', {style:{display: this.state.unsavedChanges ? '' : 'none', color:'red'}}, "Unsaved Changes"),
					)
				)
			),
			React.createElement('div', {className:"character-selector-buttons"},
				React.createElement('button', {onClick: this.handleOpen}, 'Open'),
				React.createElement('button', {onClick: this.handleSave}, this.state.saving ? 'Saving...': 'Save'),
				React.createElement('button', {onClick: this.handleDelete}, 'Delete'),
			)
		)
	}
}