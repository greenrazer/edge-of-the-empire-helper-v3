import {TypeDescriptionValueArrayBox} from '../data_array_components/TypeDescriptionValueArrayBox.js'
import {MotivationsArrayBox} from '../data_array_components/MotivationsArrayBox.js'

import {TextDataCharacterDataInput} from "../data_components/TextDataCharacterDataInput.js";
import {PositiveIntegerWithSliderCharacterDataInput} from "../data_components/PositiveIntegerWithSliderCharacterDataInput.js";

export class CharacterPane extends React.Component {
	render() {
		return React.createElement('div', {id:"character-pane", className:"pane"},
			React.createElement('div', {id:"base-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "name"], id:"base-name", name:"Name"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "playerName"], id:"base-player-name", name:"Player Name"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "species"], id:"base-species", name:"Species"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "gender"], id:"base-gender", name:"Gender"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "height"], id:"base-height", name:"Height"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "hair"], id:"base-hair", name:"Hair"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "eyes"], id:"base-eyes", name:"Eyes"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "age"], id:"base-age", name:"Age"})),
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "build"], id:"base-build", name:"Build"})),
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "notableFeatures"], id:"base-notable-features", name:"Notable Features"}))
			),
			React.createElement('div', {id:"character-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(MotivationsArrayBox, {characterDataPath: ["character", "motivations"], id:"character-motivations", name:"Motivations"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(PositiveIntegerWithSliderCharacterDataInput, {characterDataPath: ["character", "morality"], id:"character-morality", name:"Morality"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(PositiveIntegerWithSliderCharacterDataInput, {characterDataPath: ["character", "conflict"], id:"character-conflict", name:"Conflict"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["character", "emotionalWeakness"], id:"character-emotional-weakness", name:"Emotional Weakness"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["character", "emotionalStrength"], id:"character-emotional-strength", name:"Emotional Strength"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TypeDescriptionValueArrayBox, {characterDataPath: ["character", "dutys"], id:"character-dutys", name:"Duty"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TypeDescriptionValueArrayBox, {characterDataPath: ["character", "obligations"], id:"character-obligations", name:"Obligation"})),
			),
		)
	}
}