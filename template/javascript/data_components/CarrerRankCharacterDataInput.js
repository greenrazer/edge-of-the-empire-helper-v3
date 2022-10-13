import { CharacterDataInput } from './CharacterDataInput.js'

export class CareerRankCharacterDataInput extends CharacterDataInput {
	handleChange(event, val) {
		window.data.set(this.state.dataPath, val)
	}

	render() {
		let i = 0
		return React.createElement("span", {}, 
			React.createElement("i", {
				id: this.props.id + "-0",
				className: "mf mf-ban",
				onClick: (event) => this.handleChange(event, 0)
			}),
			React.createElement("i", {
				id: this.props.id + "-1",
				className: 1 <= this.state.value  ? "mf mf-square" : "mf mf-square-o",
				onClick: (event) => this.handleChange(event, 1),
			}),
			React.createElement("i", {
				id: this.props.id + "-2",
				className: 2 <= this.state.value  ? "mf mf-square" : "mf mf-square-o",
				onClick: (event) => this.handleChange(event, 2),
			}), 
			React.createElement("i", {
				id: this.props.id + "-3",
				className: 3 <= this.state.value  ? "mf mf-square" : "mf mf-square-o",
				onClick: (event) => this.handleChange(event, 3),
			}), 
			React.createElement("i", {
				id: this.props.id + "-4",
				className: 4 <= this.state.value  ? "mf mf-square" : "mf mf-square-o",
				onClick: (event) => this.handleChange(event, 4),
			}), 
			React.createElement("i", {
				id: this.props.id + "-5",
				className: 5 <= this.state.value  ? "mf mf-square" : "mf mf-square-o",
				onClick: (event) => this.handleChange(event, 5),
			}), 
		)
	}
}