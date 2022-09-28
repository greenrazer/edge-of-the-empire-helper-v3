import { CharacterDataInput } from './CharacterDataInput.js'

export class SelectCharacterDataInput extends CharacterDataInput {
	handleChange(event) {
		window.data.set(this.state.dataPath, event.target.value)
	}

	render() {
		let options = []

		for (let key in this.props.values){
			options.push(React.createElement("option", {
				value: key,
				key: key
			}, this.props.values[key]))
		}

		return [
			React.createElement("label", {
				htmlFor: this.props.id,
				key:0,
				style: {display: this.props.hideLabel ? "none": ""}
			},
			this.props.name + ":"),
			React.createElement("select", {
				name: this.props.id,
				id: this.props.id,
				onChange: this.handleChange,
				value:this.state.value,
				key:1
			}, options)
		];
	}
}