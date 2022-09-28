import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class SpecializationsArrayBox extends CharacterArrayBox {
	constructor(props){
		super(props)
	}

	defaultData() {
		return {"name": "", "career": ""}
	}

	getData() {
		let criticalInjuries = []

		for (let i = 0; i < this.state.dataLen; i++){
			criticalInjuries.push(
				React.createElement('div', {className:"col-3-grid-last-button array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "career"]), id: this.props.id + i + "-career", name: "Career"}),
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