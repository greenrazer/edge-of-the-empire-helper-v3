import { CharacterDataInput } from './CharacterDataInput.js'
import { equalArray } from '../global/utils.js';

export class PositiveIntegerCharacterDataInputBasedOn extends CharacterDataInput {
	constructor(props) {
		super(props);

		let basedDataPath = ["characters", window.data.currCharacterIndex].concat(props.characterDataPathBase)
		let basedInitValue = window.data.get(basedDataPath)
		this.state.basedDataPath = basedDataPath
		this.state.basedDataPathValue = basedInitValue
		this.dataChangeHandler2 = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.FORCE_UPDATE) {
					if (window.data.has(this.state.dataPath)){
						this.setState({
							basedDataPathValue: window.data.get(this.state.basedDataPath),
						})
					}
				}
				else if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER){
					window.data.removeListener(this.state.basedDataPath, this.dataChangeHandler2);
					let dp = ["characters", window.data.currCharacterIndex].concat(this.props.characterDataPathBase)
					if (window.data.has(dp)){
						window.data.addListener(dp, this.dataChangeHandler2)
							this.setState({
								basedDataPath: dp,
								basedDataPathValue: window.data.get(dp),
							}
						)
					}
				}
			}
			else if (equalArray(path, this.state.basedDataPath)) {
				if (!this.props.sumTogether) {
					window.data.set(this.state.dataPath, Math.max(this.state.value, newValue))
				}
				this.setState({basedDataPathValue: newValue})
			}
		};

		window.data.addListener(this.state.basedDataPath, this.dataChangeHandler2)
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeBased = this.handleChangeBased.bind(this);
	}

	componentWillUnmount() {
		super.componentWillUnmount()
		window.data.removeListener(this.state.basedDataPath, this.dataChangeHandler2);
	}

	handleChange(event) {
		if (event.target.value == ""){
			this.setState({
				value:""
			})
		}
		else{
			window.data.set(this.state.dataPath, parseInt(event.target.value) - (this.props.sumTogether ? this.state.basedDataPathValue : 0))
		}
	}

	handleChangeBased(event) {
		if (event.target.value == ""){
			this.setState({
				value:""
			})
		}
		else{
			window.data.set(this.state.basedDataPath, parseInt(event.target.value))
		}
	}

	render() {
		return [
			this.props.showBase ? React.createElement("label", {
					htmlFor: this.props.id + "-based",
					key:0,
					style: {display: this.props.hideLabel ? "none": ""}
				}, this.props.name + ":") : null,
			this.props.showBase ? React.createElement("input", {
					name: this.props.id + "-based",
					id: this.props.id + "-based",
					type: "number",
					min:0,
					step:1,
					value: this.state.basedDataPathValue,
					onChange: this.handleChangeBased,
					key:1
				}) : null,
			React.createElement("label", {
				htmlFor: this.props.id,
				key:2,
				style: {display: this.props.hideLabel ? "none": ""}
			},
			this.props.name + ":"),
			React.createElement("input", {
				name: this.props.id,
				id: this.props.id,
				type: "number",
				min: this.state.basedDataPathValue,
				step:1,
				value: (this.props.sumTogether ? this.state.basedDataPathValue : 0) + this.state.value,
				onChange: this.handleChange,
				key:3
			})
		];
	}
}