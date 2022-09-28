import {GearArrayBox} from '../data_array_components/GearArrayBox.js'
import {OtherPropertyArrayBox} from '../data_array_components/OtherPropertyArrayBox.js'
import {OwedArrayBox} from '../data_array_components/OwedArrayBox.js';
import {DebtArrayBox} from '../data_array_components/DebtArrayBox.js';

export class PropertyPane extends React.Component {
	render() {
		return React.createElement('div', {id:"property-pane", className:"pane"},
			React.createElement('div', {id:"debt-credits-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(OwedArrayBox, {characterDataPath: ["finances", "owed"], id:"owed-credits", name:"Owed"})),
				React.createElement('div', {className:"span-col-twelve-grid-half"}, React.createElement(DebtArrayBox, {characterDataPath: ["finances", "debt"], id:"debt-credits", name:"Debt"})),
			),
			React.createElement('div', {id:"gear-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(GearArrayBox, {characterDataPath: ["property", "gear"], id:"property-gear", name:"Gear"})),
			),
			React.createElement('div', {id:"other-property-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(OtherPropertyArrayBox, {characterDataPath: ["property", "other"], id:"property-gear", name:"Other Property"})),
			),
		)
	}
}