import { calcCharacterStats } from "../global/calcCharacterStats.js";

import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {SelectCharacterDataInput} from "../data_components/SelectCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

import {GenericAttachmentsArrayBox} from "./GenericAttachmentsArrayBox.js"

export class WeaponsArrayBox extends CharacterArrayBox {
	constructor(props) {
		super(props)

		this.dataChangeHandler2 = calcCharacterStats

		window.data.addListenerCurrentCharacter(['weapons'], this.dataChangeHandler2);
	}

	componentWillUnmount() {
		window.data.removeListener(['characters', this.state.currCharacter, 'weapons'], this.dataChangeHandler2);
	}

	defaultData() {
		return 	{
			"name": "test",
			"type": "test",
			"make": "test",
			"special": "test",
			"skill": "test",
			"damage": 0,
			"crit": 0,
			"encumberance": 0,
			"hardPoints": 0,
			"range": 0,
			"cost": 0,
			"condition": 0,
			"attachments": []
		}
	}

	getData() {
		let skills = []

		for (let i = 0; i < this.state.dataLen; i++){
			skills.push(
				React.createElement('div', {className:"array-box-row", key: i},
					React.createElement('div', {className:"col-6-grid-last-button"},
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
							React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "skill"]), id: this.props.id + i + "-skill", name: "Skill"}),
						),
						React.createElement('div', null,
							React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
						),
					),
					React.createElement('div', {className:"col-7-grid"},
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "damage"]), id: this.props.id + i + "-damage", name: "Damage"}),
						),
						React.createElement('div', null,
							React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "crit"]), id: this.props.id + i + "-crit", name: "Crit"}),
						),
						React.createElement('div', null,
							React.createElement(SelectCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "range"]), id: this.props.id + i + "-range", name: "Range", values: {0: "Engaged", 1: "Short", 2: "Medium", 3:"Long", 4:"Extreme"}}),
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