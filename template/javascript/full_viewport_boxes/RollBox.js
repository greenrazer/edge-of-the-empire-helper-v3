import { DiceRollSimulator } from "../global/DiceRollSimulator.js";
import { diceObjectToRollString } from "../global/utils.js";
import { AmountPicker } from "../input_components/AmountPicker.js";
import { FullViewportBox } from "./FullViewportBox.js"

export class RollBox extends FullViewportBox {
	constructor(props) {
		super(props);

		this.state = {
			green: this.props.green || 0,
			yellow: this.props.yellow || 0,
			blue: this.props.blue || 0,
			purple: this.props.purple || 0,
			red: this.props.red || 0,
			black: this.props.black || 0,
			white: this.props.white || 0,
			results: null
		}

		this.handleLocalRoll = this.handleLocalRoll.bind(this)
		this.handleSimulateRoll = this.handleSimulateRoll.bind(this)
		this.handleRoll = this.handleRoll.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleRoll() {
		this.setState({
			sending: true
		})
		let rollString = diceObjectToRollString(this.state)
		this.handleCustom(rollString).then(() => {
			setTimeout(() => {
				this.setState({
					sending: false,
				})
				this.props.removeSelf()
			}, 1000)
		}).catch((err) => {
			this.setState({
				sending: false,
			})
			console.error(err)
			alert(err.message.split(":").slice(-1)[0])
		})
	}

	handleChange(event, color) {
		let val = event.target.value
		let obj = {}
		obj[color] = val
		this.setState(obj)
	}

	handleLocalRoll(event){
		let results = DiceRollSimulator.combineResults(DiceRollSimulator.roll(this.state))
		this.setState({
			results: results
		})

	}

	handleSimulateRoll() {
		DiceRollSimulator.DebugStats(this.state)
	}

	renderLocalRoll(res){
		let results = null;
		if (res){
			let rollArr = []

			let q = 0;
			
			if ( res.success > 0){
				rollArr.push(React.createElement('span',{key: q++}, res.success, React.createElement('i', { className:"mf mf-success"})))
			}
			else if ( res.success < 0 ) {
				rollArr.push(React.createElement('span',{key: q++}, -res.success,  React.createElement('i', {className:"mf mf-failure"})))
			}

			if ( res.advantage > 0){
				rollArr.push(React.createElement('span',{key: q++}, res.advantage,  React.createElement('i', {className:"mf mf-advantage"})))
			}
			else if ( res.advantage < 0){
				rollArr.push(React.createElement('span',{key: q++}, -res.advantage,  React.createElement('i', {className:"mf mf-disadvantage"})))
			}

			if ( res.triumph > 0){
				rollArr.push(React.createElement('span',{key: q++}, res.triumph,  React.createElement('i', {className:"mf mf-triumph"})))
			}
			else if ( res.triumph < 0){
				rollArr.push(React.createElement('span',{key: q++}, -res.triumph,  React.createElement('i', {className:"mf mf-dispair"})))
			}

			if ( res.light > 0){
				rollArr.push(React.createElement('span',{key: q++}, res.light,  React.createElement('i', {className:"mf mf-light-pip"})))
			}

			if ( res.dark > 0){
				rollArr.push(React.createElement('span',{key: q++}, res.dark,  React.createElement('i', {className:"mf mf-dark-pip"})))
			}

			
			results = React.createElement('div', {className:"span-col-twelve-grid-whole"},
				React.createElement('span', null, rollArr)
			)
		}
		return results
	}

	render() {
		let inner;
		if (this.props.showWhite){
			inner = React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
				React.createElement(AmountPicker, {
					id: "pentagon-grey",
					value: this.state.white,
					name:"White",
					onChange: (event) => this.handleChange(event, "white"),
					boxes: 10,
					shape: "pentagon",
					color: "grey",
				}),
			);
		}
		else {
			inner = []

			inner.push(React.createElement('div', {className:"span-col-twelve-grid-whole", key: 0}, 
				React.createElement(AmountPicker, {
					id: "triangle-green",
					value: this.state.green,
					name:"Green",
					onChange: (event) => this.handleChange(event, "green"),
					shape: "triangle",
					color: "green",
				}),
			))

			inner.push(React.createElement('div', {className:"span-col-twelve-grid-whole", key: 1}, 
				React.createElement(AmountPicker, {
					id: "pentagon-yellow",
					value: this.state.yellow,
					name:"Yellow",
					onChange: (event) => this.handleChange(event, "yellow"),
					shape: "pentagon",
					color: "yellow",
				}),
			))

			inner.push(React.createElement('div', {className:"span-col-twelve-grid-whole", key: 2}, 
				React.createElement(AmountPicker, {
					id: "square-blue",
					value: this.state.blue,
					name:"Blue",
					onChange: (event) => this.handleChange(event, "blue"),
					shape: "square",
					color: "blue",
				}),
			))

			inner.push(React.createElement('div', {className:"span-col-twelve-grid-whole", key:3}, 
				React.createElement(AmountPicker, {
					id: "triangle-purple",
					value: this.state.purple,
					name:"Purple",
					onChange: (event) => this.handleChange(event, "purple"),
					shape: "triangle",
					color: "purple",
				}),
			))

			inner.push(React.createElement('div', {className:"span-col-twelve-grid-whole", key:4}, 
				React.createElement(AmountPicker, {
					id: "pentagon-red",
					value: this.state.red,
					name:"Red",
					onChange: (event) => this.handleChange(event, "red"),
					shape: "pentagon",
					color: "red",
				}),
			))

			inner.push(React.createElement('div', {className:"span-col-twelve-grid-whole", key:5}, 
				React.createElement(AmountPicker, {
					id: "square-black",
					value: this.state.black,
					name:"Black",
					onChange: (event) => this.handleChange(event, "black"),
					shape: "square",
					color: "black",
				}),
			))
		}

		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box", className:"fixed-centered"}, 
				React.createElement('div', {className:"col-12-grid"},
					React.createElement('div', {className:"span-col-twelve-grid-whole header-text", onClick:this.handleSimulateRoll}, "Roll For " + this.props.name),
					inner,
					React.createElement('div', {className:"span-col-twelve-grid-whole"},
						this.renderLocalRoll(this.state.results),
						React.createElement('button', {onClick: this.handleLocalRoll, className: "", title:"Local Roll"}, "Local Roll"),
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"},
						React.createElement('button', {onClick: this.handleRoll, className: "", title:"Roll"}, "Roll"),
					),
					React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Cancel"}, "Cancel"),
				)
			)
		)
	}
}