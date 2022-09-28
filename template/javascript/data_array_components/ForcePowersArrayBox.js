import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class ForcePowersArrayBox extends CharacterArrayBox {
	defaultData() {
		return 	{
			"name": "",
			"ranks": 0,
			"description": "",
			"cost":0
		}
	}

	getData() {
		let forcePowers = []

		for (let i = 0; i < this.state.dataLen; i++){
			forcePowers.push(
				React.createElement('div', {className:"col-6-grid-last-button array-box-row",key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "ranks"]), id: this.props.id + i + "-ranks", name: "Ranks"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "description"]), id: this.props.id + i + "-description", name: "Description"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "cost"]), id: this.props.id + i + "-cost", name: "XP Cost"}),
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
				
			)
		}

		return forcePowers
	}
}