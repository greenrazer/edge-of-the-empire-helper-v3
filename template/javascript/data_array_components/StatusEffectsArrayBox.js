import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {CheckboxCharacterDataInput} from "../data_components/CheckboxCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class StatusEffectsArrayBox extends CharacterArrayBox {
	defaultData() {
		return {"name": "", "active": false}
	}

	getData() {
		let statusEffects = []

		for (let i = 0; i < this.state.dataLen; i++){
			statusEffects.push(
				React.createElement('div', {className:"col-3-grid-last-button array-box-row",key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(CheckboxCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "active"]), id: this.props.id + i + "-active", name: "Active"}),
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
				
			)
		}

		return statusEffects
	}
}