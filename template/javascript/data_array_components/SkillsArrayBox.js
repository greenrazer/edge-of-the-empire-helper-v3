import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {CheckboxCharacterDataInput} from "../data_components/CheckboxCharacterDataInput.js";
import {SelectCharacterDataInput} from "../data_components/SelectCharacterDataInput.js";
import {RankCharacterDataInput} from "../data_components/RankCharacterDataInput.js";
import {DiceCharacterDataReader} from "../data_components/DiceCharacterDataReader.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";
import { RollBox } from "../full_viewport_boxes/RollBox.js";

export class SkillsArrayBox extends CharacterArrayBox {

	constructor(props) {
		super(props)

		this.state.showDiceRollIndex = -1

		this.handleRoll = this.handleRoll.bind(this)
		this.hideRollBox = this.hideRollBox.bind(this)
	}

	defaultData() {
		return 	{
			"name": "",
			"career": false,
			"rank": 0,
			"characteristic": ""
		}
	}

	handleRoll(event, i) {
		this.setState({
			showDiceRollIndex: i
		})
	}

	hideRollBox() {
		this.setState({
			showDiceRollIndex: -1
		})
	}

	getData() {
		let skills = []

		let diceBox = null
		
		
		for (let i = 0; i < this.state.dataLen; i++){
			if (this.state.showDiceRollIndex == i) {
				let skillRank = window.data.getPathCurrentCharacter(this.props.characterDataPath.concat([i, "rank"]))
				let characterisitc = window.data.getPathCurrentCharacter(this.props.characterDataPath.concat([i, "characteristic"]))
				let characteristicRank = window.data.getPathCurrentCharacter(["characteristics",characterisitc,"rank"])
				
				let green = Math.max(skillRank, characteristicRank) - Math.min(skillRank, characteristicRank)
				let yellow = Math.min(skillRank, characteristicRank) 

				diceBox = React.createElement(RollBox, {
					removeSelf:this.hideRollBox, 
					name: window.data.getPathCurrentCharacter(this.props.characterDataPath.concat([i, "name"])),
					green: green,
					yellow: yellow
				})
			}

			skills.push(
				React.createElement('div', {className:"col-7-grid-last-two-button array-box-row",key: i},
					diceBox,
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(SelectCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "characteristic"]), id: this.props.id + i + "-characteristic", name: "Characteristic", values: {"brawn": "Br","agility": "Ag","intellect": "Int","cunning": "Cun","willpower": "Will","presence": "Pr","forceRank": "Fr"}}),
					),
					React.createElement('div', null,
						React.createElement(CheckboxCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "career"]), id: this.props.id + i + "-career", name: "Career"}),
					),
					React.createElement('div', null,
						React.createElement(RankCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "rank"]), id: this.props.id + i + "-rank", name: "Rank"}),
					),
					React.createElement('div', null,
						React.createElement(DiceCharacterDataReader, {characterDataPath: this.props.characterDataPath.concat([i]), id: this.props.id + i + "-dice", name: "Dice"}),
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleRoll(event, i)}, "Roll")
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
			)
		}

		return skills
	}
}