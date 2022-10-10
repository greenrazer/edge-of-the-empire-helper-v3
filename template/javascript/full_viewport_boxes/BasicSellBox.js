import { FullViewportBox } from "./FullViewportBox.js"

export class BasicSellBox extends FullViewportBox {
	constructor(props) {
		super(props);

		this.state = {
			cost: this.props.defaultCost,
		}

		this.handleChangeCost = this.handleChangeCost.bind(this)
	}

	buyItem() {
		window.data.add(["characters", this.props.characterId, "finances", "creditsUsed"], this.props.defaultCost - this.state.cost)
		this.props.removeSelf(true)
	}

	handleChangeCost(event) {
		if(event.target.value == ""){
			this.setState({
				cost: 0
			})
		}
		this.setState({
			cost: parseInt(event.target.value)
		})
	}

	render() {

		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box", className:"fixed-centered"}, 
				React.createElement('div', {className:"col-12-grid"},
					React.createElement('div', {className:"span-col-twelve-grid-whole header-text"}, `Sell ${this.props.name} For ${this.state.cost}?`),
					React.createElement('div', {className:"span-col-twelve-grid-whole input-line"}, 
						React.createElement('input', {type:"number", min:0, step:1, onChange: this.handleChangeCost, value:this.state.cost}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement('button', {onClick: (event) => this.buyItem(), className: "", title: "Sell"}, "Sell"),
						React.createElement('button', {onClick: (event) => this.props.removeSelf(false), className: "", title:"Cancel"}, "Cancel"),
					),
				)
			)
		)
	}
}