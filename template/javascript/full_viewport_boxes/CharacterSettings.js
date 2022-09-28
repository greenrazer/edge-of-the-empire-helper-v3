import { FullViewportBox } from "./FullViewportBox.js"
import { TextDataCharacterDataInput } from "../data_components/TextDataCharacterDataInput.js";
import { PositiveIntegerCharacterDataInput } from "../data_components/PositiveIntegerCharacterDataInput.js";
import { SelectCharacterDataInput } from "../data_components/SelectCharacterDataInput.js";

export class CharacterSettings extends FullViewportBox {
	constructor(props) {
		super(props);

		this.dataChangeHandler2 = (path, newValue) => {

			let settings = window.data.getPathCurrentCharacter(["settings"])
			
			let soak = 0
			let ranged = 0
			let melee = 0
			let encumberance = 0
			
			let armors = window.data.getPathCurrentCharacter(["armor"])
			for (let armor of armors){
				soak += armor["soak"]
				melee += armor["defense"]["melee"]
				ranged += armor["defense"]["ranged"]
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, armor["encumberance"])
				}
				else{
					encumberance += armor["encumberance"]
				}
			}

			let weapons = window.data.getPathCurrentCharacter(["weapons"])
			for (let weapon of weapons){
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, weapon["encumberance"])
				}
				else{
					encumberance += weapon["encumberance"]
				}
			}

			let gears = window.data.getPathCurrentCharacter(["property", "gear"])
			for (let gear of gears){
				if (settings["encumberanceMode"] == "max") {
					encumberance = Math.max(encumberance, gear["encumberance"])
				}
				else{
					encumberance += gear["encumberance"]
				}
			}

			let brawn = window.data.getPathCurrentCharacter(["characteristics" , "brawn", "rank"])
			soak += brawn

			window.data.setPathCurrentCharacter(["stats", "soak", "base"], soak)
			window.data.setPathCurrentCharacter(["stats", "defense", "melee", "base"], melee)
			window.data.setPathCurrentCharacter(["stats", "defense", "ranged", "base"], ranged)
			window.data.setPathCurrentCharacter(["stats", "encumberance", "currentBase"], encumberance)
		};

		window.data.addListenerCurrentCharacter(['settings'], this.dataChangeHandler2);
	}

	componentWillUnmount() {
		window.data.removeListenerCurrentCharacter(['settings'], this.dataChangeHandler2);
	}

	render() {
		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box", className:"fixed-centered"}, 
				React.createElement('div', {className:"col-12-grid"},
					React.createElement('div', {className:"span-col-twelve-grid-whole header-text"}, "Character Settings"),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(TextDataCharacterDataInput, {characterDataPath: ["settings", "discordChannelId"], id:"character-settings-discord-channel-id", name:"Discord Channel Id"})
					),

					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "characterisicXp", "bias"], id:"character-settings-characteristic-xp-bias", name:"Characteristic Xp Cost Bias"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "characterisicXp", "multiplier"], id:"character-settings-characteristic-xp-multiplier", name:"Characteristic Xp Cost Multiplier"})
					),

					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "skillRankXp", "career", "bias"], id:"character-settings-skill-rank-xp-career-bias", name:"Career Skill Rank Xp Cost Bias"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "skillRankXp", "career", "multiplier"], id:"character-settings-skill-rank-xp-career-multiplier", name:"Career Skill Rank Xp Cost Multiplier"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "skillRankXp", "default", "bias"], id:"character-settings-skill-rank-xp-default-bias", name:"Default Skill Rank Xp Cost Bias"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "skillRankXp", "default", "multiplier"], id:"character-settings-skill-rank-xp-default-multiplier", name:"Default Skill Rank Xp Cost Multiplier"})
					),

					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "specializationXP", "career", "bias"], id:"character-settings-specialization-xp-career-bias", name:"Career Specialization Xp Cost Bias"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "specializationXP", "career", "multiplier"], id:"character-settings-specialization-rank-xp-career-multiplier", name:"Career Specialization Xp Cost Multiplier"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "specializationXP", "default", "bias"], id:"character-settings-specialization-xp-default-bias", name:"Default Specialization Xp Cost Bias"})
					),
					React.createElement('div', {className:"span-col-twelve-grid-whole"}, 
						React.createElement(PositiveIntegerCharacterDataInput, {characterDataPath: ["settings", "specializationXP", "default", "multiplier"], id:"character-settings-specialization-rank-xp-default-multiplier", name:"Default Specialization Xp Cost Multiplier"})
					),

					React.createElement('div', {className:"span-col-twelve-grid-whole"},
						React.createElement(SelectCharacterDataInput, {characterDataPath: ["settings", "encumberanceMode"], id: "character-settings-encumberance-mode", name: "Encumberance Mode", values: {"max": "Max Encumberance","total": "Total Encumberance"}}),
					),

					React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Ok"}, "Ok"),
				)
			)
		)
	}
}