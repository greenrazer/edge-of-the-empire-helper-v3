import {NameDescriptionArrayBox} from '../data_array_components/NameDescriptionArrayBox.js'
import {StatusEffectsArrayBox} from '../data_array_components/StatusEffectsArrayBox.js'

import {DoublePositiveIntegerCharacterDataInput} from "../data_components/DoublePositiveIntegerCharacterDataInput.js";
import {SinglePositiveIntegerCharacterDataInput} from "../data_components/SinglePositiveIntegerCharacterDataInput.js";

export class StatsPane extends React.Component {
	render() {
		return React.createElement('div', {id:"base-stats-pane", className:"pane"},
			React.createElement('div', {id:"stats-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(DoublePositiveIntegerCharacterDataInput, {sumTogether:true, characterDataPath0: ["stats", "wounds", "threshold"], characterDataPathBase0: ["stats", "wounds", "base"], characterDataPath1: ["stats", "wounds", "current"], id:"stats-wounds", name:"Wounds", name0:"Threshold", name1:"Current"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(DoublePositiveIntegerCharacterDataInput, {sumTogether:true, characterDataPath0: ["stats", "strain", "threshold"], characterDataPathBase0: ["stats", "strain", "base"], characterDataPath1: ["stats", "strain", "current"], id:"stats-strain", name:"Strain", name0:"Threshold", name1:"Current"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(SinglePositiveIntegerCharacterDataInput, {sumTogether:true, characterDataPath: ["stats", "soak", "value"], characterDataPathBase: ["stats", "soak", "base"], id:"stats-soak", name:"Soak"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(DoublePositiveIntegerCharacterDataInput, {sumTogether:true, characterDataPath0: ["stats", "defense", "ranged", "value"], characterDataPathBase0: ["stats", "defense", "ranged", "base"], characterDataPath1: ["stats", "defense", "melee", "value"], characterDataPathBase1: ["stats", "defense", "melee", "base"], id:"stats-defense", name:"Defense", name0:"Ranged", name1:"Melee"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(DoublePositiveIntegerCharacterDataInput, {sumTogether:true, characterDataPath0: ["stats", "forcePool", "committed"], characterDataPathBase0:["stats", "forcePool", "base"], characterDataPath1: ["stats", "forcePool", "available"], id:"stats-force-pool", name:"Force Pool", name0:"Committed", name1:"Available"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(DoublePositiveIntegerCharacterDataInput, {sumTogether:true, characterDataPath0: ["stats", "encumberance", "threshold"], characterDataPathBase0:["stats", "encumberance", "base"], characterDataPath1: ["stats", "encumberance", "current"], characterDataPathBase1:["stats", "encumberance", "currentBase"], id:"stats-encumberance", name:"Encumberance", name0:"Threshold", name1:"Current"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(NameDescriptionArrayBox, {characterDataPath: ["stats", "criticalInjuries"], id:"stats-critical-injuries", name:"Critical Injuries"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(StatusEffectsArrayBox, {characterDataPath: ["stats", "statusEffects"], id:"stats-status-effects", name:"Status Effects"})),
			)
		)
	}
}