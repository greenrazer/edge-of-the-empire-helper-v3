import { RankCharacterDataInput } from "./RankCharacterDataInput.js"

export class BaseRankCharacterDataInput extends RankCharacterDataInput {
	constructor(props) {
		super(props)

		let dataPath2 = ["characters", window.data.currCharacterIndex].concat(props.characterDataPath2)
		this.state.dataPath2 = dataPath2
	}

	handleChange(event, val) {
		window.data.set(this.state.dataPath, val)
		window.data.set(this.state.dataPath2, val)
	}
}