import { equalArray } from '../global/utils.js';

export class CharacterDataInput extends React.Component {
	constructor(props) {
		super(props);

		let dataPath = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath)
		let initValue = window.data.get(dataPath)
		this.state = {
			dataPath: dataPath,
			value: initValue
		};
		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.FORCE_UPDATE) {
					if (window.data.has(this.state.dataPath)){
						this.setState({
							value: window.data.get(this.state.dataPath),
						})
					}
				}
				else if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER){
					window.data.removeListener(this.state.dataPath, this.dataChangeHandler);
					let dp = ["characters", window.data.currCharacterIndex].concat(this.props.characterDataPath)
					if (window.data.has(dp)){
						window.data.addListener(dp, this.dataChangeHandler)
						this.setState({
							dataPath: dp,
							value: window.data.get(dp),
						})
					}
				}
			}
			else if (equalArray(path, this.state.dataPath)) {
				this.setState({value: newValue})
			}
		};

		window.data.addListener(dataPath, this.dataChangeHandler)
		this.handleChange = this.handleChange.bind(this);
	}

	forceUpdate() {
		this.setState({
			value: window.data.get(this.state.dataPath),
		})
	}

	handleChange(event) {
		throw "Unimplemented";
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath, this.dataChangeHandler);
	}
}