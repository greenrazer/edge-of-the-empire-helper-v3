import { ForceTreeDataInput } from "../data_components/ForceTreeDataInput.js";
import { FullViewportBox } from "./FullViewportBox.js"

export class ForcePowersSelector extends FullViewportBox {
	constructor(props) {
		super(props);

		this.state.forcePowerTreeSelected = -1
		this.state.forcePowerTrees = window.data.get(["forcePowerTrees"])
		this.state.forceRank = window.data.get(["characters", this.props.characterId, "characteristics", "forceRank", "rank"])

		this.handleSelect = this.handleSelect.bind(this)
	}

	handleSelect(i) {
		this.setState({
			forcePowerTreeSelected: i
		})
	}

	render() {
		let treeNames = []

		for(let i = 0; i < this.state.forcePowerTrees.length; i++){
			let elem = React.createElement('div', {style:{position: "relative", height: "50px"},key:i},
				React.createElement('span', {className:"width-25-percent-float-left"}, this.state.forcePowerTrees[i]["name"]),
				React.createElement('span', {className:"width-25-percent-float-left"},  this.state.forceRank < this.state.forcePowerTrees[i]["requiredRank"] ? "Required Rank: " + this.state.forcePowerTrees[i]["requiredRank"]: null),
				React.createElement('button',{className:"width-25-percent-float-left",onClick:(event) => this.handleSelect(i) }, "Open")
			)
			treeNames.push(elem)
		}

		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box-big", className:"fixed-centered"},
				React.createElement('div', {className: "height-97"},
					React.createElement('div', {id:"force-powers-name", className:"left-25"}, 
						React.createElement('div', {className: "full-height-container"},
							treeNames
						)
					),
					React.createElement('div', {id:"force-powers-tree", className:"right-75"}, 
						this.state.forcePowerTreeSelected < 0 ? "No Tree Selected" : React.createElement(ForceTreeDataInput, {characterId: this.props.characterId, treeId: this.state.forcePowerTreeSelected})
					),
				),
				React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Ok"}, "Ok"),
			)
		)
	}
}