import {WeaponsArrayBox} from '../data_array_components/WeaponsArrayBox.js'

export class WeaponsPane extends React.Component {
	render() {
		return React.createElement('div', {id:"weapons-pane", className:"pane"},
			React.createElement('div', {id:"weapons-part", className:"col-12-grid"},
				React.createElement('div', {className:"span-col-twelve-grid-whole"}, React.createElement(WeaponsArrayBox, {characterDataPath: ["weapons"], id:"weapons", name:"Weapons"})),
			),
		)
	}
}