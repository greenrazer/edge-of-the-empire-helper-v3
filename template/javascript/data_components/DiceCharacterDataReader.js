import { equalArray } from '../global/utils.js';

export class DiceCharacterDataReader extends React.Component {
	constructor(props) {
		super(props);

		let dataPath1 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["rank"])
		let initValue1 = window.data.get(dataPath1)
		let dataPath2 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["characteristic"])
		let initValue2 = window.data.get(dataPath2)
		let dataPath3 = ["characters", window.data.currCharacterIndex].concat(["characteristics",initValue2,"rank"])
		this.state = {
			dataPath1: dataPath1,
			dataPath2: dataPath2,
			dataPath3: dataPath3,
			skillRank: initValue1,
		};

		try {
			this.state.characteristicRank = window.data.get(dataPath3)
			this.state.error = false
		}
		catch(err) {
			this.state.error = true
		}

		this.dataChangeHandler = (path, newValue) => {
			if (path.length === 0) {
				if (newValue === window.data.FORCE_UPDATE) {
					if (window.data.has(this.state.dataPath1) && window.data.has(this.state.dataPath2) && window.data.has(this.state.dataPath3)){
						this.setState({
							skillRank: window.data.get(this.state.dataPath1),
							characteristicRank: window.data.get(this.state.dataPath3)
						})
					}
				}
				else if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER){
					window.data.removeListener(this.state.dataPath1, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath2, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath3, this.dataChangeHandler);
					let dataPath1 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["rank"])
					let initValue1 = window.data.get(dataPath1)
					let dataPath2 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["characteristic"])
					let initValue2 = window.data.get(dataPath2)
					let dataPath3 = ["characters", window.data.currCharacterIndex].concat(["characteristics",initValue2,"rank"])

					if (window.data.has(dataPath1) && window.data.has(dataPath2) && window.data.has(dataPath3)){
						window.data.addListener(dataPath1, this.dataChangeHandler);
						window.data.addListener(dataPath2, this.dataChangeHandler);
						try {
							let initValue3 = window.data.get(dataPath3)
							window.data.addListener(dataPath3, this.dataChangeHandler);
							this.setState({
								dataPath1: dataPath1,
								dataPath2: dataPath2,
								dataPath3: dataPath3,
								skillRank: initValue1,
								characteristicRank: initValue3,
								error:false
							})
						}
						catch(err) {
							this.setState({error: true})
						}
					}
				}
			}
			else if (equalArray(path, this.state.dataPath1)) {
				this.setState({skillRank: newValue})
			}
			else if (equalArray(path, this.state.dataPath2)) {
				window.data.removeListener(this.state.dataPath3, this.dataChangeHandler);
				let dataPath3 = ["characters", window.data.currCharacterIndex].concat(["characteristics",newValue,"rank"])
				try {
					let initValue3 = window.data.get(dataPath3)
					window.data.addListener(dataPath3, this.dataChangeHandler);
					this.setState({
						dataPath3: dataPath3,
						characteristicRank: initValue3,
						error:false
					})
				}
				catch(err) {
					this.setState({error: true})
				}
			}
			else if (equalArray(path, this.state.dataPath3)) {
				this.setState({characteristicRank: newValue})
			}
		};

		
		window.data.addListener(dataPath1, this.dataChangeHandler);
		window.data.addListener(dataPath2, this.dataChangeHandler);
		if (!this.state.error){
			window.data.addListener(dataPath3, this.dataChangeHandler);
		}
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath1, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath2, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath3, this.dataChangeHandler);
	}

	render() {
		if (this.state.error) {
			return React.createElement('span', null, "Characteristic Does Not Exist")
		}
		let dice = []

		for(let i =0; i < Math.min(this.state.skillRank, this.state.characteristicRank); i++){
			dice.push(
				React.createElement('i', {
					className: "mf mf-pentagon",
					style: {color: "yellow"},
					key:i,
				})
			)
		}

		for(let i = Math.min(this.state.skillRank, this.state.characteristicRank); i < Math.max(this.state.skillRank, this.state.characteristicRank); i++){
			dice.push(
				React.createElement('i', {
					className: "mf mf-triangle",
					style: {color: "green"},
					key:i,
				})
			)
		}

		return React.createElement("span", {}, dice)
	}
}