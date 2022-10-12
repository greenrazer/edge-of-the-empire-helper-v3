import { PositiveIntegerCharacterDataInput } from "./PositiveIntegerCharacterDataInput.js";

export class XPCharacterDataInput extends React.Component {
	constructor(props) {
		super(props);

		let characterDataPath = ["characters", this.props.characterId]

		let xpDataPath = ['xp', 'value']
		let initXP = window.data.getPathCurrentCharacter(xpDataPath)
		
		let settingsPath = ['settings']
		let settings = window.data.getPathCurrentCharacter(settingsPath)
		
		this.state = {
			characterDataPath: characterDataPath,
			xpDataPath: xpDataPath,
			xpTotal: initXP,
			xpUsed: 0,
			xpLeft: 0,
			settingsPath: settingsPath,
			settings: settings
		};

		this.setListeners()
	}

	setListeners() {
		this.dataChangeHandler = (path, newValue) => {
			if(window.data.currCharacterIndex < 0) {
				return
			}
			let xp = window.data.getPathCurrentCharacter(this.state.xpDataPath)

			let xpCosts = 0

			//Characterisitcs

			let characteristicXpBias = this.state.settings["characterisicXp"]["bias"]
			let characteristicXpMultiplier = this.state.settings["characterisicXp"]["multiplier"]

			let characteristics = window.data.getPathCurrentCharacter(["characteristics"])

			for (let charName in characteristics){
				let charBrank = characteristics[charName]["baseRank"]
				let charRank = characteristics[charName]["rank"]

				let totXp = (charRank*(charRank + 1) - charBrank*(charBrank + 1))/2
				totXp *= characteristicXpMultiplier
				totXp += characteristicXpBias * (charRank - charBrank) 

				xpCosts += totXp
			}

			//Skills

			let skillRankXpCareerBias = this.state.settings["skillRankXp"]["career"]["bias"]
			let skillRankXpCareerMultiplier = this.state.settings["skillRankXp"]["career"]["multiplier"]
			let skillRankXpDefaultBias = this.state.settings["skillRankXp"]["default"]["bias"]
			let skillRankXpDefaultMultiplier = this.state.settings["skillRankXp"]["default"]["multiplier"]

			let skills = window.data.getPathCurrentCharacter(["skills"])

			for (let skillName in skills){
				let skillRank = skills[skillName]["rank"]

				let totXp = skillRank*(skillRank + 1)/2
				let skillCareer = skills[skillName]["career"]
				if(skillCareer) {
					totXp *= skillRankXpCareerMultiplier
					totXp += skillRankXpCareerBias * skillRank
				}
				else {
					totXp *= skillRankXpDefaultMultiplier
					totXp += skillRankXpDefaultBias * skillRank
				}

				xpCosts += totXp
			}

			//Specializations

			let specializationXPCareerBias = this.state.settings["specializationXP"]["career"]["bias"]
			let specializationXPCareerMultiplier = this.state.settings["specializationXP"]["career"]["multiplier"]
			let specializationXPDefaultBias = this.state.settings["specializationXP"]["default"]["bias"]
			let specializationXPDefaultMultiplier = this.state.settings["specializationXP"]["default"]["multiplier"]

			let career = window.data.getPathCurrentCharacter(["base", "career"])
			let specializations = window.data.getPathCurrentCharacter(["base", "specializations"])

			let skip = 0

			for (let i in specializations){
				i = parseInt(i)
				
				let specializationCareer = specializations[i]["career"]
				if(specializationCareer == career && skip < 1){
					skip++
					continue
				}
				let specializationNum = i+1
				
				let totXp = 0
				if(specializationCareer == career) {
					totXp += specializationXPCareerMultiplier * specializationNum + specializationXPCareerBias
				}
				else {
					totXp += specializationXPDefaultMultiplier * specializationNum + specializationXPDefaultBias
				}

				xpCosts += totXp
			}

			// Talents
			let talents = window.data.getPathCurrentCharacter(["talents"])
			for (let careerName in talents) {
				for(let specializationName in talents[careerName]) {
					for(let talent of talents[careerName][specializationName]) {
						xpCosts += talent["xpCost"]
					}
				}
			}

			// Force Powers
			let forcePowers = window.data.getPathCurrentCharacter(["forcePowers"])
			for (let treeName in forcePowers){
				for (let forcePower of forcePowers[treeName]){
					xpCosts += forcePower["xpCost"]
				}
			}

			this.setState({
				characterDataPath: ["characters", this.props.characterId],
				xpTotal: xp,
				xpUsed: xpCosts,
				xpLeft: xp-xpCosts,
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
				React.createElement('span', null, "Total Xp"),
				React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["xp", "value"], id: "xp-value", className:"credits-xp-input-value", name: "Total XP", hideLabel:true})
			),
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Used Xp"),
				React.createElement('span', null, this.state.xpUsed),
			),
			React.createElement('div', {className:"width-33-percent-float-left"},
				React.createElement('span', null, "Left Xp"),
				React.createElement('span', null, this.state.xpLeft),
			)
		);
	}
}