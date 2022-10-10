import { PositiveIntegerCharacterDataInput } from "./PositiveIntegerCharacterDataInput.js";

export class CreditsCharacterDataInput extends React.Component {
	constructor(props) {
		super(props);
		
		let characterDataPath = ["characters", this.props.characterId]

		let creditsDataPath = ['finances', 'credits']
		let initCredits = window.data.getPathCurrentCharacter(creditsDataPath)

		let initCreditsBaseUsed = 0

		let creditsUsedDataPath = ['finances', 'creditsUsed']
		let initCreditsUsed = window.data.getPathCurrentCharacter(creditsUsedDataPath)

		let initCreditsLeft = initCredits - initCreditsBaseUsed - initCreditsUsed

		this.state = {
			characterDataPath: characterDataPath,
			creditsDataPath: creditsDataPath,
			creditsUsedDataPath:creditsUsedDataPath,
			
			creditsTotal: initCredits,
			creditsBaseUsed: initCreditsBaseUsed,
			creditsUsed: initCreditsUsed,
			creditsLeft: initCreditsLeft,
		};

		this.setListeners = this.setListeners.bind(this)
		this.setListeners()

		this.handleChange = this.handleChange.bind(this)
	}

	setListeners() {
		this.dataChangeHandler = (path, newValue) => {
			if(window.data.currCharacterIndex < 0) {
				return
			}
			let credits = window.data.getPathCurrentCharacter(this.state.creditsDataPath)
			let creditsUsed = window.data.getPathCurrentCharacter(this.state.creditsUsedDataPath)

			let creditsCosts = 0

			let owed = window.data.getPathCurrentCharacter(["finances", "owed"])
			for(let owe of owed) {
				if (owe["paid"]){
					creditsCosts -= owe["amount"]
				}
			}
			
			let debt = window.data.getPathCurrentCharacter(["finances", "debt"])
			for(let deb of debt) {
				if (deb["paid"]){
					creditsCosts += deb["amount"]
				}
			}

			let cybernetics = window.data.getPathCurrentCharacter(["cybernetics"])
			for (let cyberName in cybernetics){
				creditsCosts += cybernetics[cyberName]["cost"]
			}

			let weapons = window.data.getPathCurrentCharacter(["weapons"])
			for (let weapon of weapons){
				creditsCosts += weapon["cost"]
				for (let attachment of weapon["attachments"]) {
					creditsCosts += attachment["cost"]
					for (let modification of attachment["modifications"]){
						creditsCosts += modification["cost"]
					}
				}
			}

			let armors = window.data.getPathCurrentCharacter(["armor"])
			for (let armor of armors){
				creditsCosts += armor["cost"]
				for (let attachment of armor["attachments"]) {
					creditsCosts += attachment["cost"]
					for (let modification of attachment["modifications"]){
						creditsCosts += modification["cost"]
					}
				}
			}

			this.setState({
				characterDataPath: ["characters", this.props.characterId],
				creditsDataPath: ["finances", "credits"],
				creditsUsedDataPath: ["finances", "creditsUsed"],
				
				creditsTotal: credits,
				creditsBaseUsed: creditsCosts,
				creditsUsed: creditsUsed,
				creditsLeft: credits - creditsCosts - creditsUsed,
			})
		};

		window.data.addListenerCurrentCharacter([], this.dataChangeHandler);
	}

	componentDidUpdate() {
		window.data.removeListener(this.state.characterDataPath, this.dataChangeHandler);
		this.setListeners()
	}

	componentDidMount() {
		this.dataChangeHandler(null, null) 
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.characterDataPath, this.dataChangeHandler);
	}

	handleChange(event) {
		if (event.target.value == ""){
			this.setState({
				value:""
			})
		}
		else{
			window.data.setPathCurrentCharacter(this.state.creditsUsedDataPath, parseInt(event.target.value) - this.state.creditsBaseUsed)
		}
	}

	render() {
		return React.createElement('div', null,
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Total Credits"),
				React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["finances", "credits"], id: "finances-credits", className:"credits-xp-input-value", name: "Total Credits", hideLabel:true})
			),
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Used Credits"),
				React.createElement("label", {
					htmlFor: this.props.id,
					style: {display: "none"}
				},
				this.props.name + ":"),
				React.createElement("input", {
					className:"credits-xp-input-value",
					type: "number",
					step:1,
					value: this.state.creditsBaseUsed + this.state.creditsUsed,
					onChange: this.handleChange,
				})
			),
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Left Credits"),
				React.createElement('span', null, this.state.creditsLeft),
			)
		);
	}
}