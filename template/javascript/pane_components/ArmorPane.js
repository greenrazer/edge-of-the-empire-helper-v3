import {ArmorArrayBox} from '../data_array_components/ArmorArrayBox.js'

export class ArmorPane extends React.Component {
	render() {
		return React.createElement('div', {id:"armor-pane", className:"pane"},
			React.createElement('div', {id:"armor-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(ArmorArrayBox, {characterDataPath: ["armor"], id:"armor", name:"Armor"})),
			),
		)
	}
}