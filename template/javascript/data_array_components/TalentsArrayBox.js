import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class TalentsArrayBox extends CharacterArrayBox {
	defaultData() {
		return 	{
			"name": "",
			"ranks": 0,
			"description": "",
			"specialization": "",
			"cost":0
		}
	}

	getData() {
		let skills = []

		for (let i = 0; i < this.state.dataLen; i++){
			skills.push(
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
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "specialization"]), id: this.props.id + i + "-specialization-name", name: "Specialization"}),
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

		return skills
	}
}