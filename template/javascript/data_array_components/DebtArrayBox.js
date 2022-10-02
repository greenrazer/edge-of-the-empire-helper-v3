import { TextDataCharacterDataInput } from "../data_components/TextDataCharacterDataInput.js";
import { PositiveIntegerCharacterDataInput } from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CheckboxCharacterDataInput } from "../data_components/CheckboxCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";

export class DebtArrayBox extends CharacterArrayBox {
	defaultData() {
		return {"creditor": "", "amount": 0, "reason": "", "paid": false}
	}

	getData() {
		let debtItems = []

		for (let i = 0; i < this.state.dataLen; i++){
			debtItems.push(
				React.createElement('div', {className:"col-5-grid-last-button array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "creditor"]), id: this.props.id + i + "-creditor", name: "Creditor"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "amount"]), id: this.props.id + i + "-amount", name: "Amount"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "reason"]), id: this.props.id + i + "-reason", name: "Reason"}),
					),
					React.createElement('div', null,
						React.createElement(CheckboxCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "paid"]), id: this.props.id + i + "-paid", name: "Paid"}),
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
			)
		}

		return debtItems
	}
}