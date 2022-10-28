import { PositiveIntegerCharacterDataInput } from "../data_components/PositiveIntegerCharacterDataInput.js";
import { TextDataCharacterDataInput } from "../data_components/TextDataCharacterDataInput.js";
import { ForcePowersSelector } from "../full_viewport_boxes/ForcePowersSelector.js";
import { forcePowersObjToRenderArray } from "../global/utils.js";

export class ForcePowerObjectSelectionBox extends React.Component {
	constructor(props) {
		super(props)

		let dataPath = ["characters", window.data.currCharacterIndex, "forcePowers"]
		let initData = forcePowersObjToRenderArray(window.data.get(dataPath))

		let customForcePowersDataPath = ["characters", window.data.currCharacterIndex, "customForcePowers"]
		let initCustomFocePowersData = window.data.get(customForcePowersDataPath)
		
		this.state = {
			dataPath: dataPath,
			customForcePowersDataPath: customForcePowersDataPath,
			customForcePowers: initCustomFocePowersData,
			renderArray: initData,
			currCharacter: window.data.currCharacterIndex,
		};

		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER || newValue === window.data.FORCE_UPDATE){
					let dp = ["characters", window.data.currCharacterIndex, "forcePowers"]
					window.data.removeListener(this.state.dataPath, this.dataChangeHandler);
					if (window.data.has(dp)){
						window.data.addListener(dp, this.dataChangeHandler)
						this.setState({
							dataPath: dp,
							renderArray: forcePowersObjToRenderArray(window.data.get(dp)),
						})
					}
				}
			}
			else {
				this.setState({
					renderArray: forcePowersObjToRenderArray(window.data.get(this.state.dataPath))
				})
			}
		};

		this.dataChangeHandler2 = (path, newValue) => {
			this.setState({
				customForcePowers:window.data.get(this.state.customForcePowersDataPath)
			})
		}

		window.data.addListener(customForcePowersDataPath, this.dataChangeHandler2)
		window.data.addListener(dataPath, this.dataChangeHandler)

		this.state.selectorVisible = false
		this.handleCustom = this.handleCustom.bind(this)
		this.handleChoose = this.handleChoose.bind(this)
		this.showSelector = this.showSelector.bind(this)
		this.hideSelector = this.hideSelector.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath, this.dataChangeHandler)
		window.data.removeListener(this.state.customForcePowersDataPath, this.dataChangeHandler2)
	}

	handleCustom(event) {
		window.data.push(this.state.customForcePowersDataPath, {
			"name": "",
			"tree": "",
			"description": "",
			"ranks": 0,
			"xpCost":0
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
		window.data.remove(this.state.customForcePowersDataPath, i)
		window.data.alertAllListenersBelow(this.state.customForcePowersDataPath)
	}

	getInner() {
		if (this.state.selectorVisible) {
			return React.createElement(ForcePowersSelector, {
				removeSelf: this.hideSelector,
				characterId: this.state.currCharacter
			})
		}

		let forcePowers = []
 
		let k = 0
		for (let i in this.state.renderArray){
			forcePowers.push(
				React.createElement('div', {className:"col-6-grid-last-button array-box-row",key: i},
					React.createElement('div', null,
						React.createElement("label", {
							htmlFor: this.props.id + "-" + i + "-" + 'tree',
						},"Tree:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'tree',
							id: this.props.id + "-" + i + "-" + 'tree',
							type: "text",
							value: this.state.renderArray[i]["tree"],
							readOnly: true,
						})
					),
					React.createElement('div', null,
						React.createElement("label", {
							htmlFor: this.props.id + "-" + i + "-" + 'name',
						},"Name:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'name',
							id: this.props.id + "-" + i + "-" + 'name',
							type: "text",
							value: this.state.renderArray[i]["name"],
							readOnly: true,
						})
					),
					React.createElement('div', null,
						React.createElement("label", {
							htmlFor: this.props.id + "-" + i + "-" + 'description',
						},"Description:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'description',
							id: this.props.id + "-" + i + "-" + 'description',
							type: "text",
							value: this.state.renderArray[i]["description"],
							readOnly: true,
						})
					),
					React.createElement('div', null,
						React.createElement("label", {
							htmlFor: this.props.id + "-" + i + "-" + 'rank',
						},"Rank:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'rank',
							id: this.props.id + "-" + i + "-" + 'rank',
							type: "number",
							min:0,
							step:1,
							value: this.state.renderArray[i]["rank"],
							readOnly: true,
						})
					),
					React.createElement('div', null,
						React.createElement("label", {
							htmlFor: this.props.id + "-" + i + "-" + 'xpCost',
						},"xpCost:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'xpCost',
							id: this.props.id + "-" + i + "-" + 'xpCost',
							type: "number",
							min:0,
							step:1,
							value: this.state.renderArray[i]["xpCost"],
							readOnly: true,
						})
					),
				)
			)
			k++;
		}

		for (let i in this.state.customForcePowers){
			forcePowers.push(
				React.createElement('div', {className:"col-7-grid-last-button array-box-row",key: k},
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: ["customForcePowers", i, "tree"], name: "Tree"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: ["customForcePowers", i, "name"], name: "Name"}),
					),
					React.createElement('div', null,
						React.createElement(TextDataCharacterDataInput, {characterDataPath: ["customForcePowers", i, "description"], name: "Description"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["customForcePowers", i, "ranks"], name: "Ranks"}),
					),
					React.createElement('div', null,
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["customForcePowers", i, "xpCost"], name: "XP Cost"}),
					),
					React.createElement('div', null,
						React.createElement('button', {onClick: (event) => this.handleDelete(event, i)}, "Delete")
					)
				)
			)
			k++;
		}

		return forcePowers
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