import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

import {NameDescriptionArrayBox} from "./NameDescriptionArrayBox.js"
import {NameDescriptionCostArrayBox} from "./NameDescriptionCostArrayBox.js"

export class GenericAttachmentsArrayBox extends CharacterArrayBox {
	defaultData() {
		return 	{
			"name": "",
			"hardPointReq": 0,
			"cost":0,
			"baseModifiers": [],
			"modifications": [],
		}
	}

	getData() {
		let skills = []

		for (let i = 0; i < this.state.dataLen; i++){
			skills.push(
				React.createElement('div', {className:"col-6-grid-last-button array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "hardPointReq"]), id: this.props.id + i + "-hard-point-req", name: "Hard Point Reqirement"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "cost"]), id: this.props.id + i + "-cost", name: "Cost"}),
					),
					React.createElement('div', null,
						React.createElement(NameDescriptionArrayBox, {characterDataPath: this.props.characterDataPath.concat([i, "baseModifiers"]), id: this.props.id + i + "-base-modifiers", name:"Base Modifiers"}),
					),
					React.createElement('div', null,
						React.createElement(NameDescriptionCostArrayBox, {characterDataPath: this.props.characterDataPath.concat([i, "modifications"]), id: this.props.id + i + "-modifications", name:"Modifications"}),
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