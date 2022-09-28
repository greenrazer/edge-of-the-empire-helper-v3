import { CharacterDataInput } from './CharacterDataInput.js'

export class PositiveIntegerCharacterDataInput extends CharacterDataInput {
	handleChange(event) {
		if (event.target.value == ""){
			this.setState({
				value:""
			})
		}
		else{
			window.data.set(this.state.dataPath, parseInt(event.target.value))
		}
	}

	render() {
		return [
			React.createElement("label", {
				htmlFor: this.props.id,
				key:0,
				style: {display: this.props.hideLabel ? "none": ""}
			},
			this.props.name + ":"),
			React.createElement("input", {
				name: this.props.id,
				id: this.props.id,
				className: this.props.className,
				type: "number",
				min:0,
				step:1,
				value: this.state.value,
				onChange: this.handleChange,
				key:1
			})
		];
	}
}