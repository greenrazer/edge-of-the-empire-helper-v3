import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class TypeDescriptionValueArrayBox extends CharacterArrayBox {
	defaultData() {
		return {"type": "", "description": "", "value":0}
	}

	getData() {
		let criticalInjuries = []

		for (let i = 0; i < this.state.dataLen; i++){
			criticalInjuries.push(
				React.createElement('div', {className:"col-4-grid-last-button array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "type"]), id: this.props.id + i + "-type", name: "Type"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "description"]), id: this.props.id + i + "-description", name: "Description"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "value"]), id: this.props.id + i + "-value", name: "Value"}),
					),	
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
			)
		}

		return criticalInjuries
	}
}