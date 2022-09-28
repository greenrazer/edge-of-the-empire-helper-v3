import {SkillsArrayBox} from '../data_array_components/SkillsArrayBox.js'
import { CharacterisitcDataInput } from '../data_components/CharacteristicCharacterDataInput.js';

export class CharacteristicsSkillsPane extends React.Component {
	render() {
		return React.createElement('div', {id:"characteristics-skills-pane", className:"pane"},
			React.createElement('div', {id:"characteristics-part", className:"col-7-grid"},
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "brawn"], id:"characteristics-brawn", name:"Brawn", bname:"Roll"})),
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "agility"], id:"characteristics-agility", name:"Agility", bname:"Roll"})),
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "intellect"], id:"characteristics-intellect", name:"Intellect", bname:"Roll"})),
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "cunning"], id:"characteristics-cunning", name:"Cunning", bname:"Roll"})),
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "willpower"], id:"characteristics-willpower", name:"Willpower", bname:"Roll"})),
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "presence"], id:"characteristics-presence", name:"Presence", bname:"Roll"})),
				React.createElement('div', null, React.createElement(CharacterisitcDataInput, {characterDataPath: ["characteristics", "forceRank"], id:"stats-force-rank", name:"Force Rank", bname:"Roll", showWhite: true}))
			),
			React.createElement('div', {id:"skills-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(SkillsArrayBox, {characterDataPath: ["skills"], id:"skills", name:"Skills"})),
			)
		)
	}
}