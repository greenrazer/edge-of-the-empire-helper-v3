import {SpecializationsArrayBox} from '../data_array_components/SpecializationsArrayBox.js'
import {TalentsArrayBox} from '../data_array_components/TalentsArrayBox.js'
import { TextDataCharacterDataInput } from '../data_components/TextDataCharacterDataInput.js';
import { ForcePowerObjectSelectionBox } from '../data_object_components/ForcePowerObjectSelectionBox.js';

export class TalentsSpecializationsPane extends React.Component {
	render() {
		return React.createElement('div', {id:"talents-specializations-pane", className:"pane"},
			React.createElement('div', {id:"career-specializations-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(TextDataCharacterDataInput, {characterDataPath: ["base", "career"], id:"base-career", name:"Career"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(SpecializationsArrayBox, {characterDataPath: ["base", "specializations"], id:"base-specializations", name:"Specializations"})),
			),
			React.createElement('div', {id:"forcePowerPart", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(ForcePowerObjectSelectionBox, {characterDataPath: ["forcePowers"], id:"force-powers", name:"Force Powers"})),
			),
			React.createElement('div', {id:"talents-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(TalentsArrayBox, {characterDataPath: ["talents"], id:"base-talents", name:"Talents"})),
			)
		)
	}
}
