import { TextDataCharacterDataInput } from "../data_components/TextDataCharacterDataInput.js";
import { TalentsSelector } from "../full_viewport_boxes/TalentsSelector.js";

export class SpecializationsObjectSelectionBox extends React.Component {
	constructor(props) {
		super(props)

		let dataPath = ["characters", window.data.currCharacterIndex, "base", "specializations"]
		let initData = window.data.get(dataPath)

		let customSpecializationsDataPath = ["characters", window.data.currCharacterIndex, "base", "customSpecializations"]
		let customSpecializationsData = window.data.get(customSpecializationsDataPath)
		
		this.state = {
			dataPath: dataPath,
			renderArray: initData,
			customSpecializationsDataPath: customSpecializationsDataPath,
			customSpecializationsData: customSpecializationsData,
			currCharacter: window.data.currCharacterIndex,
		};

		this.dataChangeHandler = (path, newValue) => {
			this.setState({
				renderArray: window.data.get(this.state.dataPath)
			})
		};

		this.dataChangeHandler2 = (path, newValue) => {
			this.setState({
				customSpecializationsData: window.data.get(this.state.customSpecializationsDataPath)
			})
		};
		window.data.addListener(dataPath, this.dataChangeHandler)
		window.data.addListener(customSpecializationsDataPath, this.dataChangeHandler2)

		this.state.selectorVisible = false
		this.handleCustom = this.handleCustom.bind(this)
		this.handleChoose = this.handleChoose.bind(this)
		this.showSelector = this.showSelector.bind(this)
		this.hideSelector = this.hideSelector.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath, this.dataChangeHandler)
		window.data.removeListener(this.state.customSpecializationsDataPath, this.dataChangeHandler2)
	}

	handleCustom(event) {
		window.data.push(this.state.customSpecializationsDataPath, {
			"name": "",
			"career": "",
		})
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

	handleDelete(event, i) {
		window.data.remove(this.state.customSpecializationsDataPath, i)
		window.data.alertAllListenersBelow(this.state.customSpecializationsDataPath)
	}

	getInner() {
		if (this.state.selectorVisible) {
			return React.createElement(TalentsSelector, {
				removeSelf: this.hideSelector,
				characterId: this.state.currCharacter
			})
		}

		let specializations = []

		let k = 0

		for (let i in this.state.renderArray){
			specializations.push(
				React.createElement('div', {className:"col-2-grid array-box-row", key: i},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {readOnly: true, characterDataPath: this.props.characterDataPath.concat([i, "career"]), id: this.props.id + i + "-career", name: "Career"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {readOnly: true, characterDataPath: this.props.characterDataPath.concat([i, "name"]), id: this.props.id + i + "-name", name: "Name"}),
					),
				)
			)
			k++
		}

		for (let i in this.state.customSpecializationsData){
			specializations.push(
				React.createElement('div', {className:"col-3-grid-last-button array-box-row",key: k},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "customSpecializations", i, "name"], name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "customSpecializations", i, "career"], name: "Career"}),
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
			)
			k++;
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