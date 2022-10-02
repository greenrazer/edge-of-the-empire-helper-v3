import { calcCharacterStats } from "../global/calcCharacterStats.js";

import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class GearArrayBox extends CharacterArrayBox {
	constructor(props) {
		super(props)

		this.dataChangeHandler2 = calcCharacterStats

		window.data.addListenerCurrentCharacter(['property', 'gear'], this.dataChangeHandler2);
	}

	componentWillUnmount() {
		window.data.removeListener(['characters', this.state.currCharacter, 'property', 'gear'], this.dataChangeHandler2);
	}

	defaultData() {
		return {"name": "", "quantity": 0, "costPerQuantity":0, "encumberance": 0}
	}

	getData() {
		let criticalInjuries = []

		for (let i = 0; i < this.state.dataLen; i++){
			criticalInjuries.push(
				React.createElement('div', {className:"col-5-grid-last-button array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-type", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "quantity"]), id: this.props.id + i + "-quantity", name: "Quantity"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "costPerQuantity"]), id: this.props.id + i + "-costPerQuantity", name: "Cost Per Quantity"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "encumberance"]), id: this.props.id + i + "-encumberance", name: "Encumberance Per Quantity"}),
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