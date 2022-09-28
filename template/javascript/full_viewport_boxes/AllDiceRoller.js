import { DiceRollSimulator } from "../global/DiceRollSimulator.js";
import { copy, polyDiceObjectToRollString } from "../global/utils.js";
import { AmountPicker } from "../input_components/AmountPicker.js";
import { RollBox } from "./RollBox.js";

export class AllDiceRoller extends RollBox {
	constructor(props) {
		super(props)

		this.state.quantity = 1
		this.state.sides = 1
		this.state.polyDice = []
		this.state.polyResults = null

		this.handlePolyRoll = this.handlePolyRoll.bind(this)
		this.handlePolyChange = this.handlePolyChange.bind(this)
		this.handlePolyAdd = this.handlePolyAdd.bind(this)
		this.handleLocalPolyRoll = this.handleLocalPolyRoll.bind(this)
	}

	handlePolyRoll() {
		if (this.state.polyDice.length == 0) {
			return
		}
		this.setState({
			sendingPoly: true
		})
		let rollString = polyDiceObjectToRollString(this.state.polyDice)
		this.handleCustom(rollString).then(() => {
			setTimeout(() => {
				this.setState({
					sendingPoly: false,
				})
				this.props.removeSelf()
			}, 1000)
		}).catch((err) => {
			this.setState({
				sendingPoly: false,
			})
			console.error(err)
			alert(err.message.split(":").slice(-1)[0])
		})
	}

	handlePolyChange(event, id) {
		let val = event.target.value
		let obj = {}
		obj[id] = val
		this.setState(obj)
	}

	handlePolyAdd(event) {
		let q = parseInt(this.state.quantity);
		let s = parseInt(this.state.sides);

		let p = this.state.polyDice

		p.push({
			quantity: q,
			sides: s,
		})

		this.setState({
			polyDice: p,
		})
	}

	handleLocalPolyRoll(event) {
		let results = DiceRollSimulator.polyRoll(this.state.polyDice)
		this.setState({
			polyResults: results
		})
	}

	renderPolyLocalRoll(polyDice, results) {
		if(results == null){
			return null
		}
		let polyDiceResults= []
		let q = 0
		for (let i in results) {
			let rolls = results[i].rolls.join(" + ")
			let sum = results[i].sum
			polyDiceResults.push(React.createElement('div', {key: q++},
				React.createElement('span', null, `${polyDice[i].quantity}d${polyDice[i].sides} (${rolls}) =  ${sum}`)
			))
		}
		return polyDiceResults
	}

	render() {
		let polyDiceString = [];
		for (let i in this.state.polyDice) {
			let v = this.state.polyDice[i]
			polyDiceString.push(`${v.quantity}d${v.sides}`)
		}
		polyDiceString = polyDiceString.join(" ")

		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box", className:"fixed-centered"}, 
				React.createElement('div', {className:"col-12-grid"},
					React.createElement('div', {className:"span-col-twelve-grid-whole header-text", onClick: this.handleSimulateRoll}, "Roll Dice"),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id:"triangle-green",
							value: this.state.green,
							name:"Green",
							onChange: (event) => this.handleChange(event, "green"),
							boxes:10,
							shape: "triangle",
							color: "green",
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id:"pentagon-yellow",
							value: this.state.yellow,
							name:"Yellow",
							onChange: (event) => this.handleChange(event, "yellow"),
							boxes:10,
							shape: "pentagon",
							color: "yellow"
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id: "square-blue",
							value: this.state.blue,
							name:"Blue",
							onChange: (event) => this.handleChange(event, "blue"),
							boxes:10,
							shape: "square",
							color: "blue"
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id: "triangle-purple",
							value: this.state.purple,
							name:"Purple",
							onChange: (event) => this.handleChange(event, "purple"),
							boxes:10,
							shape: "triangle",
							color: "purple"
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id: "pentagon-red",
							value: this.state.red,
							name:"Red",
							onChange: (event) => this.handleChange(event, "red"),
							boxes:10,
							shape: "pentagon",
							color: "red"
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id: "square-black",
							value: this.state.black,
							name:"Black",
							onChange: (event) => this.handleChange(event, "black"),
							boxes:10,
							shape: "square",
							color: "black"
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(AmountPicker, {
							id: "pentagon-white",
							value: this.state.white,
							name:"White",
							onChange: (event) => this.handleChange(event, "white"),
							boxes:10,
							shape: "pentagon",
							color: "grey"
						}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						this.renderLocalRoll(this.state.results),
						React.createElement('button', {onClick: this.handleLocalRoll, className: "", title:"Local Roll"}, "Local Roll"),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						this.state.sending ? 'Sending' : null,
						React.createElement('button', {onClick: this.handleRoll, className: "", title:"Roll"}, "Roll"),
						React.createElement('button', {onClick: (event) => this.handleCustom("!destiny roll"), className: "", title:"Destiny Roll"}, "Destiny Roll"),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement('hr'),
					),
					React.createElement('div', {className:"span-col-twelve-grid-three-fourths"}, 
						React.createElement('input', {
							min:1,
							step:1,
							type: "number",
							value:this.state.quantity,
							className:"width-40-percent", 
							onChange: (event) => this.handlePolyChange(event, "quantity")}),
						React.createElement('span', null, 'd'),
						React.createElement('input', {
							min:1,
							step:1,
							type: "number",
							value:this.state.sides,
							className:"width-40-percent", 
							onChange: (event) => this.handlePolyChange(event, "sides")}),
					),
					React.createElement('div', {className:"span-col-twelve-grid-fourth"}, 
						React.createElement('button', {onClick: this.handlePolyAdd, className: "", title:"Add"}, "Add"),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement('span', null, polyDiceString),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						this.renderPolyLocalRoll(this.state.polyDice, this.state.polyResults),
						React.createElement('button', {onClick: this.handleLocalPolyRoll, className: "", title:"Poly Local Roll"}, "Poly Local Roll"),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						this.state.sendingPoly ? 'Sending' : null,
						React.createElement('button', {onClick: this.handlePolyRoll, className: "", title:"Poly Roll"}, "Poly Roll"),
						React.createElement('button', {onClick: (event) => this.handleCustom("!poly 1d100"), className: "", title:"Roll 1 d100"}, "Roll 1 d100"),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"},
						React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Cancel"}, "Cancel"),
					),
				)
			)
		)
	}
}