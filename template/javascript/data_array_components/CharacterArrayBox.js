import { equalArray } from "../global/utils.js";

export class CharacterArrayBox extends React.Component {
	constructor(props) {
		super(props);

		let dataPath = ["characters", window.data.currCharacterIndex].concat(this.props.characterDataPath)
		let initData = window.data.get(dataPath)
		this.state = {
			dataPath: dataPath,
			dataLen: initData.length
		};

		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER || newValue === window.data.FORCE_UPDATE){
					let dp = ["characters", window.data.currCharacterIndex].concat(this.props.characterDataPath)
					window.data.removeListener(this.state.dataPath, this.dataChangeHandler);
					if (window.data.has(dp)){
						window.data.addListener(dp, this.dataChangeHandler)
						this.setState({
							dataPath: dp,
							dataLen: window.data.get(dp).length,
						})
					}
				}
			}
			else if (equalArray(path, this.state.dataPath)) {
				this.setState({dataLen: window.data.get(this.state.dataPath).length})
			}
		};
		window.data.addListener(dataPath, this.dataChangeHandler)
		this.handleNew = this.handleNew.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}
	
	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath, this.dataChangeHandler);
	}

	handleNew(event) {
		window.data.push(this.state.dataPath, this.defaultData())
	}

	handleDelete(event, i) {
		window.data.remove(this.state.dataPath, i)
		window.data.alertAllListenersBelow(this.state.dataPath)
	}

	render() {
		let data = this.getData()

		return React.createElement('div', null,
			React.createElement('div', null, 
				React.createElement('span', null, this.props.name),
				React.createElement('button', {onClick: this.handleNew, className: "margin-sides", title:"Add"}, React.createElement('i', {className:"mf mf-plus"})),
			),
			React.createElement('div', {className: "array-box-inner"}, data),
		);
	}
}