import { TextDataCharacterDataInput } from "../data_components/TextDataCharacterDataInput.js";
import { TalentsSelector } from "../full_viewport_boxes/TalentsSelector.js";

export class SpecializationsObjectSelectionBox extends React.Component {
	constructor(props) {
		super(props)

		let dataPath = ["characters", window.data.currCharacterIndex, "base", "specializations"]
		let initData = window.data.get(dataPath)
		
		this.state = {
			dataPath: dataPath,
			renderArray: initData,
			currCharacter: window.data.currCharacterIndex,
		};

		this.dataChangeHandler = (path, newValue) => {
			this.setState({
				renderArray: window.data.get(this.state.dataPath)
			})
		};
		window.data.addListener(dataPath, this.dataChangeHandler)

		this.state.selectorVisible = false
		this.handleCustom = this.handleCustom.bind(this)
		this.handleChoose = this.handleChoose.bind(this)
		this.showSelector = this.showSelector.bind(this)
		this.hideSelector = this.hideSelector.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath, this.dataChangeHandler)
	}

	handleCustom(event) {

	}

	handleChoose(event) {
		this.showSelector()
	}

	showSelector() {
		this.setState({
			selectorVisible: true
		})
	}

	hideSelector(event) {
		this.setState({
			selectorVisible: false
		})
	}

	getInner() {
		if (this.state.selectorVisible) {
			return React.createElement(TalentsSelector, {
				removeSelf: this.hideSelector,
				characterId: this.state.currCharacter
			})
		}

		let specializations = []

		for (let i in this.state.renderArray){
			specializations.push(
				React.createElement('div', {className:"col-2-grid array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {readOnly: true, characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {readOnly: true, characterDataPath: this.props.characterDataPath.concat([i, "career"]), id: this.props.id + i + "-career", name: "Career"}),
					),
				)
			)
		}

		return specializations
	}

	render() {
		let inner = this.getInner()

		return React.createElement('div', null,
			React.createElement('div', null, 
				React.createElement('span', null, this.props.name),
				React.createElement('button', {onClick: this.handleChoose, className: "margin-sides", title:"Choose"}, "Choose"),
				React.createElement('button', {onClick: this.handleCustom, className: "margin-sides", title:"Add Custom"}, "Add Custom"),
			),
			React.createElement('div', {className: "array-box-inner"}, 
				inner
			),
		);
	}
}