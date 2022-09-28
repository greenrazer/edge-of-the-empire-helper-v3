import { RollBox } from '../full_viewport_boxes/RollBox.js'
import { PositiveIntegerCharacterDataInputBasedOn } from './PositiveIntegerCharacterDataInputBasedOn.js'

export class CharacterisitcDataInput extends React.Component {
	
	constructor(props) {
		super(props)

		this.state = {}
		this.state.showDiceRollBox = false

		this.dataChangeHandler2 = (path, newValue) => {

			let settings = window.data.getPathCurrentCharacter(["settings"])
			
			let soak = 0
			let ranged = 0
			let melee = 0
			let encumberance = 0
			
			let armors = window.data.getPathCurrentCharacter(["armor"])
			for (let armor of armors){
				soak += armor["soak"]
				melee += armor["defense"]["melee"]
				ranged += armor["defense"]["ranged"]
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, armor["encumberance"])
				}
				else{
					encumberance += armor["encumberance"]
				}
			}

			let weapons = window.data.getPathCurrentCharacter(["weapons"])
			for (let weapon of weapons){
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, weapon["encumberance"])
				}
				else{
					encumberance += weapon["encumberance"]
				}
			}

			let gears = window.data.getPathCurrentCharacter(["property", "gear"])
			for (let gear of gears){
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, gear["encumberance"])
				}
				else{
					encumberance += gear["encumberance"]
				}
			}

			let brawn = window.data.getPathCurrentCharacter(["characteristics" , "brawn", "rank"])
			soak += brawn

			window.data.setPathCurrentCharacter(["stats", "soak", "base"], soak)
			window.data.setPathCurrentCharacter(["stats", "defense", "melee", "base"], melee)
			window.data.setPathCurrentCharacter(["stats", "defense", "ranged", "base"], ranged)
			window.data.setPathCurrentCharacter(["stats", "encumberance", "currentBase"], encumberance)
		};

		window.data.addListenerCurrentCharacter(['characteristics'], this.dataChangeHandler2);

		this.handleRoll = this.handleRoll.bind(this)
		this.hideRollBox = this.hideRollBox.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListenerCurrentCharacter(['characteristics'], this.dataChangeHandler2);
	}

	handleRoll(event, i) {
		this.setState({
			showDiceRollBox: true
		})
	}

	hideRollBox() {
		this.setState({
			showDiceRollBox: false
		})
	}

	render() {
		let diceBox = null

		if( this.state.showDiceRollBox){
			let characteristicRank = window.data.getPathCurrentCharacter(this.props.characterDataPath.concat(["rank"]))

			diceBox = React.createElement(RollBox, {
				removeSelf:this.hideRollBox, 
				name: window.data.getPathCurrentCharacter(this.props.characterDataPath.concat(["name"])),
				green: this.props.showWhite ? 0 : characteristicRank,
				white: this.props.showWhite ? characteristicRank : 0,
				showWhite: this.props.showWhite,
			})
		}

		return React.createElement('div', {className:"single-positive-integer"},
			diceBox,
			React.createElement('div', {className:"single-positive-integer-input-name"}, this.props.name),
			React.createElement('div', {className:"single-positive-integer-input"},
				React.createElement(PositiveIntegerCharacterDataInputBasedOn, {characterDataPath: this.props.characterDataPath.concat(["rank"]), characterDataPathBase: this.props.characterDataPath.concat(["baseRank"]), id: this.props.id, name: this.props.name, hideLabel:true, showBase: true}),
			),
			React.createElement('button', {onClick: this.handleRoll, className:"single-positive-integer-input-button"}, this.props.bname)
		);
	}
}