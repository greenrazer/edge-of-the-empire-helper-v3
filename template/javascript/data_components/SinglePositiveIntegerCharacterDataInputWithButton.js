import { PositiveIntegerCharacterDataInputBasedOn } from './PositiveIntegerCharacterDataInputBasedOn.js'

export class SinglePositiveIntegerCharacterDataInputWithButton extends React.Component {
	render() {
		return React.createElement('div', {className:"single-positive-integer"},
			React.createElement('div', {className:"single-positive-integer-input-name"}, this.props.name),
			React.createElement('div', {className:"single-positive-integer-input"},
				React.createElement(PositiveIntegerCharacterDataInputBasedOn, {characterDataPath: this.props.characterDataPath, characterDataPathBase: this.props.characterDataPathBase, id: this.props.id, name: this.props.name, hideLabel:true}),
			),
			React.createElement('button', {className:"single-positive-integer-input-button"}, this.props.bname)
		);
	}
}