import { FullViewportBox } from "./FullViewportBox.js"
import { camelCaseToTitleCase } from "../global/utils.js";

export class GlobalSettings extends FullViewportBox {
	constructor(props) {
		super(props);

		window.api.getGlobalSettings().then((value) => {
			this.setState(value)
		});

		this.handleSave = this.handleSave.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleSave() {
		window.api.setGlobalSettings(this.state)
		this.props.removeSelf()
	}

	handleChange(id, event) {
		let obj = {}
		obj[id] = event.target.value
		this.setState(obj)
	}

	render() {
		let arr = []

		let q = 0

		for(let key in this.state){
			let value = this.state[key]
			let inputId = `global-settings-input-${key}`
			let title = camelCaseToTitleCase(key)

			let elem = React.createElement('div', {className:"span-col-twelve-grid-whole", key:q++},
				React.createElement("label", {htmlFor: inputId}, title),
				React.createElement("input", {
					name: inputId,
					id: inputId,
					type: "text",
					value: value,
					onChange: (event) => this.handleChange(key, event),
				})
			)

			arr.push(elem)
		}


		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box", className:"fixed-centered"}, 
				React.createElement('div', {className:"col-12-grid"},
					React.createElement('div', {className:"span-col-twelve-grid-whole header-text"}, "Global Settings"),
					arr,
					React.createElement('button', {onClick: this.handleSave, className: "", title:"Ok"}, "Ok"),
					React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Cancel"}, "Cancel"),
				)
			)
		)
	}
}