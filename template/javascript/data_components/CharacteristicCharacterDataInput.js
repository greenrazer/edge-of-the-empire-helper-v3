import { calcCharacterStats } from "../global/calcCharacterStats.js";

import { RollBox } from '../full_viewport_boxes/RollBox.js'
import { PositiveIntegerCharacterDataInputBasedOn } from './PositiveIntegerCharacterDataInputBasedOn.js'

export class CharacterisitcDataInput extends React.Component {
	
	constructor(props) {
		super(props)

		this.state = {
			showDiceRollBox: false,
			currCharacter: window.data.currCharacterIndex
		}

		this.dataChangeHandler2 = calcCharacterStats;

		window.data.addListenerCurrentCharacter(['characteristics'], this.dataChangeHandler2);

		this.handleRoll = this.handleRoll.bind(this)
		this.hideRollBox = this.hideRollBox.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener(['characters', this.state.currCharacter ,'characteristics'], this.dataChangeHandler2);
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