import { calcCharacterStats } from "../global/calcCharacterStats.js";

import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {SelectCharacterDataInput} from "../data_components/SelectCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

import {GenericAttachmentsArrayBox} from "./GenericAttachmentsArrayBox.js"
import { BasicSellBox } from "../full_viewport_boxes/BasicSellBox.js";

export class ArmorArrayBox extends CharacterArrayBox {
	constructor(props) {
		super(props)

		this.state.sellIndex = -1
		this.state.sellName = ""

		this.dataChangeHandler2 = calcCharacterStats

		window.data.addListenerCurrentCharacter(['armor'], this.dataChangeHandler2);

		this.handleReimburse = this.handleReimburse.bind(this)
		this.hideSell = this.hideSell.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener(['characters', this.state.currCharacter, 'armor'], this.dataChangeHandler2);
	}

	defaultData() {
		return 	{
			"name": "",
			"type": "",
			"make": "",
			"special": "",
			"soak": 0,
			"defense": {
				"melee": 0,
				"ranged":0
			},
			"encumberance": 0,
			"hardPoints": 0,
			"condition": 0,
			"cost": 0,
			"attachments": [],
		}
	}

	handleReimburse(event, i) {
		let cost = 0
		let armor = window.data.getPathCurrentCharacter(["armor", i])
		cost += armor["cost"]
		for (let attachment of armor["attachments"]) {
			cost += attachment["cost"]
			for (let modification of attachment["modifications"]){
				cost += modification["cost"]
			}
		}

		window.data.add(["characters", this.state.currCharacter, "finances", "creditsUsed"], cost)
		this.handleDelete(event, i)
	}

	handleSell(event, i) {
		this.setState({
			sellIndex: i,
			sellName: window.data.get(["characters", this.state.currCharacter].concat(this.props.characterDataPath.concat([i, "name"])))
		})
	}

	hideSell(removed) {
		if (removed) {
			this.handleDelete(null, this.state.sellIndex)
		}
		this.setState({
			sellIndex: -1,
		})
	}

	getData() {
		let skills = []

		for (let i = 0; i < this.state.dataLen; i++){
			let buySell = null

			let cost = 0
			let armor = window.data.getPathCurrentCharacter(["armor", i])
			cost += armor["cost"]
			for (let attachment of armor["attachments"]) {
				cost += attachment["cost"]
				for (let modification of attachment["modifications"]){
					cost += modification["cost"]
				}
			}

			if (this.state.sellIndex == i) {
				buySell = React.createElement(BasicSellBox, {
					removeSelf: this.hideSell, 
					characterId: this.state.currCharacter,
					defaultCost:cost,
					name: this.state.sellName
				})
			}

			skills.push(
				React.createElement('div', {className:"array-box-row", key: i},
					buySell,
					React.createElement('div', {className:"col-6-grid-last-two-button"},
						React.createElement('div', null,
							React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
						),
						React.createElement('div', null,
							React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "type"]), id: this.props.id + i + "-type", name: "Type"}),
						),
						React.createElement('div', null,
							React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "make"]), id: this.props.id + i + "-make", name: "Make"}),
						),
						React.createElement('div', null,
							React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "special"]), id: this.props.id + i + "-special", name: "Special"}),
						),
						React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleReimburse(event, i)}, "Delete")
						),
						React.createElement('div', null,
							React.createElement('button', {onClick: (event) => this.handleSell(event, i)}, "Sell")
						),
					),
					React.createElement('div', {className:"col-7-grid"},
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "soak"]), id: this.props.id + i + "-soak", name: "Soak"}),
						),
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "defense", "melee"]), id: this.props.id + i + "-defence-melee", name: "Melee Defense"}),
						),
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "defense", "ranged"]), id: this.props.id + i + "-defence-ranged", name: "Ranged Defence"}),
						),
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "encumberance"]), id: this.props.id + i + "-encumberance", name: "Encumberance"}),
						),
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "hardPoints"]), id: this.props.id + i + "-hardPoints", name: "Hard Points"}),
						),
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "cost"]), id: this.props.id + i + "-cost", name: "Cost"}),
						),
						React.createElement('div', null,
							React.createElement(SelectCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "condition"]), id: this.props.id + i + "-condition", name: "Condition", values: {0: "No Damage", 1: "Minor Damage", 2: "Moderate Damage", 3: "Major Damage"}}),
						),
					),
					React.createElement('div', {className:""},
						React.createElement('div', null,
							React.createElement(GenericAttachmentsArrayBox, {characterDataPath: this.props.characterDataPath.concat([i, "attachments"]), id: this.props.id + i + "-attachments", name: "Attachments"}),
						),
					)
				)
			)
		}
		return skills
	}
}