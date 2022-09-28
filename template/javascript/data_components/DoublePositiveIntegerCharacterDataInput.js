import { PositiveIntegerCharacterDataInputBasedOn } from './PositiveIntegerCharacterDataInputBasedOn.js'
import { PositiveIntegerCharacterDataInput } from './PositiveIntegerCharacterDataInput.js'

export class DoublePositiveIntegerCharacterDataInput extends React.Component {
	render() {
		let inner_two 
		if (this.props.characterDataPathBase1 != null) {
			inner_two = React.createElement(PositiveIntegerCharacterDataInputBasedOn, {sumTogether: this.props.sumTogether, characterDataPath: this.props.characterDataPath1, characterDataPathBase: this.props.characterDataPathBase1, id: this.props.id + "-1", name: this.props.name1})
		}
		else{
			inner_two = React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: this.props.characterDataPath1, id: this.props.id + "-1", name: this.props.name1})
		}

		return React.createElement('div', {className:"double-positive-integer"},
			React.createElement('div', {className:"double-positive-integer-input-name"}, this.props.name),
			React.createElement('div', {className:"double-positive-integer-input"},
				React.createElement(PositiveIntegerCharacterDataInputBasedOn, {sumTogether: this.props.sumTogether, characterDataPath: this.props.characterDataPath0, characterDataPathBase: this.props.characterDataPathBase0, id: this.props.id + "-0", name: this.props.name0}),
			),
			React.createElement('div', {className:"double-positive-integer-input"},
				inner_two
			)
		);
	}
}