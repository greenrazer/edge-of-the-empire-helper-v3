import { equalArray } from '../global/utils.js';

export class DiceCharacterDataReader extends React.Component {
	constructor(props) {
		super(props);

		let dataPath1 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["rank"])
		let initValue1 = window.data.get(dataPath1)
		let dataPath2 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["characteristic"])
		let initValue2 = window.data.get(dataPath2)
		let dataPath3 = ["characters", window.data.currCharacterIndex].concat(["characteristics",initValue2,"rank"])
		let dataPath4 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["careerActivatorCount"])
		let initValue4 = window.data.get(dataPath4)
		let dataPath5 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["careerRank"])
		let initValue5 = window.data.get(dataPath5)
		let dataPath6 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["career"])
		let initValue6 = window.data.get(dataPath6)

		this.state = {
			dataPath1: dataPath1,
			dataPath2: dataPath2,
			dataPath3: dataPath3,
			dataPath4: dataPath4,
			dataPath5: dataPath5,
			dataPath6: dataPath6,
			skillRank: initValue1,
			skillActivationCount: initValue4,
			skillCareerRank: initValue5,
			career: initValue6
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
					if (window.data.has(this.state.dataPath1) && 
							window.data.has(this.state.dataPath3) && 
							window.data.has(this.state.dataPath4) &&
							window.data.has(this.state.dataPath5) && 
							window.data.has(this.state.dataPath6)){
						this.setState({
							skillRank: window.data.get(this.state.dataPath1),
							characteristicRank: window.data.get(this.state.dataPath3),
							skillActivationCount: window.data.get(this.state.dataPath4),
							skillCareerRank: window.data.get(this.state.dataPath5),
							career: window.data.get(this.state.dataPath6),
						})
					}
				}
				else if (newValue === window.data.ALL_DATA_CHANGED || newValue === window.data.SET_CURRENT_CHARACTER){
					window.data.removeListener(this.state.dataPath1, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath2, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath3, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath4, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath5, this.dataChangeHandler);
					window.data.removeListener(this.state.dataPath6, this.dataChangeHandler);
					let dataPath1 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["rank"])
					let initValue1 = window.data.get(dataPath1)
					let dataPath2 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["characteristic"])
					let initValue2 = window.data.get(dataPath2)
					let dataPath3 = ["characters", window.data.currCharacterIndex].concat(["characteristics",initValue2,"rank"])
					let dataPath4 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["careerActivatorCount"])
					let initValue4 = window.data.get(dataPath4)
					let dataPath5 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["careerRank"])
					let initValue5 = window.data.get(dataPath5)
					let dataPath6 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath).concat(["career"])
					let initValue6 = window.data.get(dataPath6)

					if (window.data.has(dataPath1) && 
							window.data.has(dataPath2) && 
							window.data.has(dataPath3) && 
							window.data.has(dataPath4) && 
							window.data.has(dataPath5) &&
							window.data.has(dataPath6)){
						window.data.addListener(dataPath1, this.dataChangeHandler);
						window.data.addListener(dataPath2, this.dataChangeHandler);
						// 3RD one later
						window.data.addListener(dataPath4, this.dataChangeHandler);
						window.data.addListener(dataPath5, this.dataChangeHandler);
						window.data.addListener(dataPath6, this.dataChangeHandler);
						try {
							let initValue3 = window.data.get(dataPath3)
							window.data.addListener(dataPath3, this.dataChangeHandler);
							this.setState({
								dataPath1: dataPath1,
								dataPath2: dataPath2,
								dataPath3: dataPath3,
								dataPath4: dataPath4,
								dataPath5: dataPath5,
								dataPath6: dataPath6,
								skillRank: initValue1,
								characteristicRank: initValue3,
								skillActivationCount: initValue4,
								skillCareerRank: initValue5,
								career: initValue6,
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
			else if (equalArray(path, this.state.dataPath4)) {
				this.setState({skillActivationCount: newValue})
			}
			else if (equalArray(path, this.state.dataPath5)) {
				this.setState({skillCareerRank: newValue})
			}
			else if (equalArray(path, this.state.dataPath6)) {
				this.setState({career: newValue})
			}
		};

		
		window.data.addListener(dataPath1, this.dataChangeHandler);
		window.data.addListener(dataPath2, this.dataChangeHandler);
		if (!this.state.error){
			window.data.addListener(dataPath3, this.dataChangeHandler);
		}
		window.data.addListener(dataPath4, this.dataChangeHandler);
		window.data.addListener(dataPath5, this.dataChangeHandler);
		window.data.addListener(dataPath6, this.dataChangeHandler);
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.dataPath1, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath2, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath3, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath4, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath5, this.dataChangeHandler);
		window.data.removeListener(this.state.dataPath6, this.dataChangeHandler);
	}

	render() {
		if (this.state.error) {
			return React.createElement('span', null, "Characteristic Does Not Exist")
		}
		let dice = []

		let rank = this.state.career || this.state.skillActivationCount > 0 ? this.state.skillCareerRank : this.state.skillRank

		for(let i =0; i < Math.min(rank, this.state.characteristicRank); i++){
			dice.push(
				React.createElement('i', {
					className: "mf mf-pentagon",
					style: {color: "yellow"},
					key:i,
				})
			)
		}

		for(let i = Math.min(rank, this.state.characteristicRank); i < Math.max(rank, this.state.characteristicRank); i++){
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