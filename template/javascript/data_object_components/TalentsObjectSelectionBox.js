import { TalentsSelector } from "../full_viewport_boxes/TalentsSelector.js";
import { talentsObjToRenderArray } from "../global/utils.js";

export class TalentsObjectSelectionBox extends React.Component {
	constructor(props) {
		super(props)

		let dataPath = ["characters", window.data.currCharacterIndex, "talents"]
		let initData = talentsObjToRenderArray(window.data.get(dataPath))
		
		this.state = {
			dataPath: dataPath,
			renderArray: initData,
			currCharacter: window.data.currCharacterIndex,
		};

		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER || newValue === window.data.FORCE_UPDATE){
					let dp = ["characters", window.data.currCharacterIndex, "talents"]
					window.data.removeListener(this.state.dataPath, this.dataChangeHandler);
					if (window.data.has(dp)){
						window.data.addListener(dp, this.dataChangeHandler)
						this.setState({
							dataPath: dp,
							renderArray: talentsObjToRenderArray(window.data.get(dp)),
						})
					}
				}
			}
			else {
				this.setState({
					renderArray: talentsObjToRenderArray(window.data.get(this.state.dataPath))
				})
			}
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

		let talents = []

		for (let i in this.state.renderArray){
			talents.push(
				React.createElement('div', {className:"col-6-grid-last-button array-box-row",key: i},
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
							htmlFor: this.props.id + "-" + i + "-" + 'specialization',
						},"Specialization:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'specialization',
							id: this.props.id + "-" + i + "-" + 'specialization',
							type: "text",
							value: this.state.renderArray[i]["specialization"],
							readOnly: true,
						})
					),
					React.createElement('div', null,
						React.createElement("label", {
							htmlFor: this.props.id + "-" + i + "-" + 'career',
						},"Career:"),
						React.createElement("input", {
							name: this.props.id + "-" + i + "-" + 'career',
							id: this.props.id + "-" + i + "-" + 'career',
							type: "text",
							value: this.state.renderArray[i]["career"],
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
		}

		return talents
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