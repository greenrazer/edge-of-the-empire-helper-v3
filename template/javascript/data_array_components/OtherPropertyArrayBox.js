import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerCharacterDataInput} from "../data_components/PositiveIntegerCharacterDataInput.js";
import { CharacterArrayBox } from "./CharacterArrayBox.js";
import { BuySellBox } from "../full_viewport_boxes/BuySellBox.js";

export class OtherPropertyArrayBox extends CharacterArrayBox {
	constructor(props) {
		super(props)
		this.state.buySellIndex = -1
		this.state.buy = true

		this.handleBuy = this.handleBuy.bind(this)
		this.handleSell = this.handleSell.bind(this)
		this.hideBuySell = this.hideBuySell.bind(this)
	}

	defaultData() {
		return {"name": "", "quantity": 0, "costPerQuantity":0, "encumberance": 0, "location": ""}
	}

	handleBuy(event, i) {
		this.setState({
			buySellIndex: i,
			buy: true
		})
	}

	handleSell(event, i) {
		this.setState({
			buySellIndex: i,
			buy: false
		})
	}

	hideBuySell() {
		this.setState({
			buySellIndex: -1
		})
	}

	getData() {
		let otherProperty = []

		for (let i = 0; i < this.state.dataLen; i++){
			let buySell = null

			if (this.state.buySellIndex == i) {
				buySell = React.createElement(BuySellBox, {
					removeSelf: this.hideBuySell, 
					buy: this.state.buy,
					characterId: this.state.currCharacter,
					characterDataPath: this.props.characterDataPath.concat([i]),
					costCharacterDataPath: this.props.characterDataPath.concat([i, "costPerQuantity"]),
					quantityCharacterDataPath: this.props.characterDataPath.concat([i, "quantity"]),
				})
			}

			otherProperty.push(
				React.createElement('div', {className:"col-8-grid-last-three-button array-box-row", key: i},
					buySell,
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
						React.createElement(TextDataCharacterDataInput, {characterDataPath: this.props.characterDataPath.concat([i, "location"]), id: this.props.id + i + "-location", name: "Location"}),
					),	
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleBuy(event, i)}, "Buy")
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleSell(event, i)}, "Sell")
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
			)
		}

		return otherProperty
	}
}