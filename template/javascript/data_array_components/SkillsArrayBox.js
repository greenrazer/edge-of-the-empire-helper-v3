import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {SelectCharacterDataInput} from "../data_components/SelectCharacterDataInput.js";
import {DiceCharacterDataReader} from "../data_components/DiceCharacterDataReader.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";
import { RollBox } from "../full_viewport_boxes/RollBox.js";
import { CareerRankCharacterDataInput } from "../data_components/CarrerRankCharacterDataInput.js";
import { BaseRankCharacterDataInput } from "../data_components/BaseRankCharacterDataInput.js";

export class SkillsArrayBox extends CharacterArrayBox {

	constructor(props) {
		super(props)

		this.state.showDiceRollIndex = -1

		this.state.skillsDataPath = ["characters", window.data.currCharacterIndex].concat(this.props.characterDataPath)
		this.state.skills = window.data.get(this.state.skillsDataPath)

		this.dataChangeHandler2 = (path, newValue) => {
			this.setState({
				skills: window.data.get(this.state.skillsDataPath)
			})
		}

		window.data.addListener(this.state.skillsDataPath, this.dataChangeHandler2)

		this.handleRoll = this.handleRoll.bind(this)
		this.hideRollBox = this.hideRollBox.bind(this)
		this.isCareer = this.isCareer.bind(this)
		this.handleChangeCareer = this.handleChangeCareer.bind(this)
	}

	componentWillUnmount() {
		super.componentWillUnmount()
		window.data.removeListener(this.state.skillsDataPath, this.dataChangeHandler2)
	}

	defaultData() {
		return 	{
			"name": "",
			"career": false,
			"rank": 0,
			"characteristic": "",
			"careerRank":0,
			"careerActivatorCount":0,
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

	isCareer(i) {
		if (this.state.skills[i]["careerActivatorCount"] > 0){
			return true
		}

		return this.state.skills[i]["career"]

	}

	handleChangeCareer(event, i) {
		if (this.state.skills[i]["careerActivatorCount"] > 0){
			return
		}
		if (event.target.checked){
			let currRank = window.data.get(this.state.skillsDataPath.concat([i, "rank"]))
			window.data.set(this.state.skillsDataPath.concat([i, "careerRank"]), currRank)
		}
		window.data.set(this.state.skillsDataPath.concat([i, "career"]), event.target.checked)
	}

	getData() {
		let skills = []

		let diceBox = null
		
		
		for (let i = 0; i < this.state.dataLen; i++){
			if (this.state.showDiceRollIndex == i) {
				let skillRank = window.data.getPathCurrentCharacter(this.props.characterDataPath.concat([i, this.state.skills[i]["careerActivatorCount"] > 0 || this.state.skills[i]["career"] ? "careerRank": "rank"]))
				
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
			else {
				diceBox = null
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
						React.createElement("label", {
							htmlFor: this.props.id + i + "-career",
							style: {display: this.props.hideLabel ? "none": ""}
						},
						"Career :"),
						React.createElement("input", {
							name: this.props.id + i + "-career",
							id: this.props.id + i + "-career",
							type: "checkbox",
							checked: this.isCareer(i),
							onChange: (event) => this.handleChangeCareer(event, i),
						})
					),
					React.createElement('div', null,
						this.isCareer(i) ? React.createElement(CareerRankCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "careerRank"]), id: this.props.id + i + "-rank", name: "Rank"}) : React.createElement(BaseRankCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "rank"]), characterDataPath2: this.props.characterDataPath.concat([i, "careerRank"]), id: this.props.id + i + "-rank", name: "Rank"}),
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