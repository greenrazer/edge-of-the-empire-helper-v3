import {PaneManager} from "./pane_components/PaneManager.js"
import {TextDataCharacterDataInput} from "./data_components/TextDataCharacterDataInput.js"
import { XPCharacterDataInput } from "./data_components/XPCharacterDataInput.js";
import { CreditsCharacterDataInput } from "./data_components/CreditsCharacterDataInput.js";
import { CharacterSettings } from "./full_viewport_boxes/CharacterSettings.js";
import { AllDiceRoller } from "./full_viewport_boxes/AllDiceRoller.js";

export class MainContent extends React.Component {
	constructor(props) {
		super(props);

		let initId = window.data.currCharacterIndex
		let initUnsaved = initId < 0 ? false : window.data.get(["characterEditorInfo", window.data.currCharacterIndex, 'unsaved'])
		this.state = { 
			characterId: initId,
			saving:false,
			unsavedChanges:initUnsaved,
			showCharacterSettings:false
		};
		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue != window.data.CHARACTER_ADDED){
					if (window.data.currCharacterIndex == -1){
						this.setState({
							characterId: window.data.currCharacterIndex
						})
					}
					else {
						this.setState({
							characterId: window.data.currCharacterIndex,
							unsavedChanges: window.data.get(['characterEditorInfo', window.data.currCharacterIndex, 'unsaved'])
						})
					}
				}
			}
			else if (path[0] == "characterEditorInfo" && path[1] == this.state.characterId && path[2] == 'unsaved'){
				this.setState({
					unsavedChanges: newValue
				})
			}
		};

		window.data.addListener([], this.dataChangeHandler)

		this.handleSave = this.handleSave.bind(this)
		this.handleExport = this.handleExport.bind(this)
		this.showCharacterSettings = this.showCharacterSettings.bind(this)
		this.hideCharacterSettings = this.hideCharacterSettings.bind(this)
		this.showDiceRoller = this.showDiceRoller.bind(this)
		this.hideDiceRoller = this.hideDiceRoller.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener([], this.dataChangeHandler)
	}

	handleSave(event) {
		if ( window.data.get(["characters", this.state.characterId, "meta", "filename"]) == "" ){
			alert("Must have filename in order to save.")
			return
		}
		this.setState({
			saving:true
		})
		window.api.saveCharacter(window.data.get(["characters", this.state.characterId])).then((value) => {
			setTimeout(() => {
				this.setState({
					saving:false,
					unsavedChanges:false
				})
				window.data.set(['characterEditorInfo', this.state.characterId, 'unsaved'], false)
			},1000);
		});
	}

	handleExport(event) {
		window.api.exportJson(window.data.get(["characters", this.state.characterId]))
	}

	showCharacterSettings(event) {
		this.setState({
			showCharacterSettings:true,
		})
	}

	hideCharacterSettings(){
		this.setState({
			showCharacterSettings:false,
		})
	}

	showDiceRoller(event) {
		this.setState({
			showDiceRoller:true,
		})
	}

	hideDiceRoller(){
		this.setState({
			showDiceRoller:false,
		})
	}

	render() {
		if ( this.state.characterId < 0) {
			return React.createElement('div', {id:'right'}, 
				React.createElement('span', null, "No Character Selected")
			)
		}
		return React.createElement('div', {id:'right'},
			this.state.showCharacterSettings ? React.createElement(CharacterSettings, {removeSelf: this.hideCharacterSettings}) : null,
			this.state.showDiceRoller ? React.createElement(AllDiceRoller, {removeSelf: this.hideDiceRoller}) : null,
			React.createElement('div', {id:'main-content'},
				React.createElement('div', {id:'main-content-top-bar'},
					React.createElement('button', {title:"Save Character", onClick:this.handleSave}, React.createElement('i', {className:"mf mf-save"})),
					React.createElement('span', {style:{display: this.state.saving ? '' : 'none'}}, "Saving"),
					React.createElement('span', {style:{display: this.state.unsavedChanges ? '' : 'none', color:'red'}}, "Unsaved Changes"),
					React.createElement('button', {onClick:this.showCharacterSettings ,title:"Character Settings"}, React.createElement('i', {className:"mf mf-gear"})),
					React.createElement('button', {onClick:this.showDiceRoller, title:"Roll Dice"}, React.createElement('i', {className:"mf mf-dice"})),
					React.createElement('button', {onClick:this.handleExport, title:"Export File"}, React.createElement('i', {className:"mf mf-upload"})),
					React.createElement(XPCharacterDataInput, {characterId: this.state.characterId}),
					React.createElement(CreditsCharacterDataInput, {characterId: this.state.characterId}),

				),
				React.createElement(PaneManager, {
					characterId: this.state.characterId
				})
			)
		)
	}
}