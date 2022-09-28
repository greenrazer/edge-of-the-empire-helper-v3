import { CharacterDataInput } from './CharacterDataInput.js'
import { PositiveIntegerCharacterDataInput } from './PositiveIntegerCharacterDataInput.js'

export class PositiveIntegerWithSliderCharacterDataInput extends CharacterDataInput {
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
		return React.createElement('div', null,
			React.createElement('div', {className:"positive-integer-with-slider-input-name"}, this.props.name),
			React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath, id: this.props.id, name: this.props.name, hideLabel:true}),
			React.createElement("label", {
				htmlFor: this.props.id,
				key:0,
				style: {display: "none"}
			},
			this.props.name + ":"),
			React.createElement("input", {
				name: this.props.id,
				id: this.props.id,
				type: "range",
				min:0,
				max:100,
				step:1,
				value: this.state.value,
				onChange: this.handleChange,
				key:1
			})
		)
	}
}