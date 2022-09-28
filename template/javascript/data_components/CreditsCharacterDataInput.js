import { PositiveIntegerCharacterDataInput } from "./PositiveIntegerCharacterDataInput.js";

export class CreditsCharacterDataInput extends React.Component {
	constructor(props) {
		super(props);
		
		let characterDataPath = ["characters", this.props.characterId]

		let creditsDataPath = ['finances', 'credits']
		let initCredits = window.data.getPathCurrentCharacter(creditsDataPath)

		this.state = {
			characterDataPath: characterDataPath,
			creditsDataPath: creditsDataPath,
			creditsTotal: initCredits,
			creditsUsed: 0,
			creditsLeft: 0,
		};

		this.setListeners()
	}

	setListeners() {
		this.dataChangeHandler = (path, newValue) => {
			let credits = window.data.getPathCurrentCharacter(this.state.creditsDataPath)

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

			let gear = window.data.getPathCurrentCharacter(["property", "gear"])
			for(let object of gear) {
				creditsCosts += object["quantity"] * object["costPerQuantity"]
			}

			let other = window.data.getPathCurrentCharacter(["property", "other"])
			for(let object of other) {
				creditsCosts += object["quantity"] * object["costPerQuantity"]
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
				creditsTotal: credits,
				creditsUsed: creditsCosts,
				creditsLeft: credits-creditsCosts,
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

	render() {
		return React.createElement('div', null,
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Total Credits"),
				React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["finances", "credits"], id: "finances-credits", className:"credits-xp-input-value", name: "Total Credits", hideLabel:true})
			),
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Used Credits"),
				React.createElement('span', null, this.state.creditsUsed),
			),
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Left Credits"),
				React.createElement('span', null, this.state.creditsLeft),
			)
		);
	}
}