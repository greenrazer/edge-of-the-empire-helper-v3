import { CharacterDataInput } from './CharacterDataInput.js'

export class TextAreaCharacterDataInput extends CharacterDataInput {
	handleChange(event) {
		window.data.set(this.state.dataPath, event.target.value)
	}

	render() {
		return [
			React.createElement("label", {
				htmlFor: this.props.id,
				key:0,
				style: {display: this.props.hideLabel ? "none": ""}
			},
			this.props.name + ":"),
			React.createElement("textarea", {
				name: this.props.id,
				id: this.props.id,
				value: this.state.value,
				onChange: this.handleChange,
				readOnly: this.props.readOnly,
				key:1,
			})
		]
	}
}