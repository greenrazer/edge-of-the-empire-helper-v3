import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class GearArrayBox extends CharacterArrayBox {
	constructor(props) {
		super(props)

		this.dataChangeHandler2 = (path, newValue) => {
			if (path.length === 0) {
				return
			}

			if(window.data.currCharacterIndex < 0) {
				return
			}

			let settings = window.data.getPathCurrentCharacter(["settings"])
			
			let soak = 0
			let ranged = 0
			let melee = 0
			let encumberance = 0
			
			let armors = window.data.getPathCurrentCharacter(["armor"])
			for (let armor of armors){
				soak += armor["soak"]
				melee += armor["defense"]["melee"]
				ranged += armor["defense"]["ranged"]
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, armor["encumberance"])
				}
				else{
					encumberance += armor["encumberance"]
				}
			}

			let weapons = window.data.getPathCurrentCharacter(["weapons"])
			for (let weapon of weapons){
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, weapon["encumberance"])
				}
				else{
					encumberance += weapon["encumberance"]
				}
			}

			let gears = window.data.getPathCurrentCharacter(["property", "gear"])
			for (let gear of gears){
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, gear["encumberance"])
				}
				else{
					encumberance += gear["encumberance"]
				}
			}

			let brawn = window.data.getPathCurrentCharacter(["characteristics" , "brawn", "rank"])
			soak += brawn

			window.data.setPathCurrentCharacter(["stats", "soak", "base"], soak)
			window.data.setPathCurrentCharacter(["stats", "defense", "melee", "base"], melee)
			window.data.setPathCurrentCharacter(["stats", "defense", "ranged", "base"], ranged)
			window.data.setPathCurrentCharacter(["stats", "encumberance", "currentBase"], encumberance)
		};

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