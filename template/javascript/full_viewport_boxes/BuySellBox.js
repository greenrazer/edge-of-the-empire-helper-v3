import { FullViewportBox } from "./FullViewportBox.js"

export class BuySellBox extends FullViewportBox {
	constructor(props) {
		super(props);

		let item = window.data.getPathCurrentCharacter(this.props.characterDataPath)
		let cost = window.data.getPathCurrentCharacter(this.props.costCharacterDataPath)

		this.state = {
			buySellItem: item,
			quantity: 1,
			cost: cost,
		}

		this.handleChangeCost = this.handleChangeCost.bind(this)
		this.handleChangeQuantity = this.handleChangeQuantity.bind(this)
	}

	componentWillUnmount() {
	}

	buyItem() {
		window.data.addPathCurrentCharacter(this.props.quantityCharacterDataPath, (this.props.buy ? 1 : -1)*this.state.quantity)
		window.data.addPathCurrentCharacter(["finances", "creditsUsed"], (this.props.buy ? 1 : -1)*this.state.quantity*this.state.cost)
		this.props.removeSelf()
	}

	handleChangeQuantity(event) {
		this.setState({
			quantity: parseInt(event.target.value)
		})
	}

	handleChangeCost(event) {
		this.setState({
			cost: parseInt(event.target.value)
		})
	}

	render() {

		let buySellString = this.props.buy ? "Buy" : "Sell"

		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box", className:"fixed-centered"}, 
				React.createElement('div', {className:"col-12-grid"},
					React.createElement('div', {className:"span-col-twelve-grid-whole header-text"}, `${buySellString} ${this.state.buySellItem["name"]}`),
					React.createElement('div', {className:"span-col-twelve-grid-whole input-line"}, 
						React.createElement('span', {}, buySellString),
						React.createElement('input', {type:"number", min:0, step:1, onChange: this.handleChangeQuantity, value:this.state.quantity}),
						React.createElement('span', {}, " for "),
						React.createElement('input', {type:"number", min:0, step:1, onChange: this.handleChangeCost, value:this.state.cost}),
						React.createElement('span', {}, " credits per quantity for a total of "),
						React.createElement('input', {readOnly:true, value:this.state.quantity*this.state.cost}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement('button', {onClick: (event) => this.buyItem(), className: "", title: buySellString}, buySellString),
						React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Cancel"}, "Cancel"),
					),
				)
			)
		)
	}
}