import {CharacterPane} from './CharacterPane.js';
import {StatsPane} from './StatsPane.js';
import {CharacteristicsSkillsPane} from './CharacteristicsSkillsPane.js';
import {TalentsSpecializationsPane} from './TalentsSpecializationsPane.js';
import {ArmorPane} from './ArmorPane.js';
import {WeaponsPane} from './WeaponsPane.js';
import {CyberneticsPane} from './CyberneticsPane.js';
import {PropertyPane} from './PropertyPane.js';
import {NotesPane} from './NotesPane.js';


export class PaneManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currPane:0
		}

		this.panes = [
			{name: "Character", component: CharacterPane},
			{name: "Stats", component: StatsPane},
			{name: "Characteristics/Skills", component: CharacteristicsSkillsPane},
			{name: "Talents", component: TalentsSpecializationsPane},
			{name: "Armor", component: ArmorPane},
			{name: "Weapons", component: WeaponsPane},
			{name: "Cybernetics", component: CyberneticsPane},
			{name: "Property", component:PropertyPane},
			{name: "Notes", component:NotesPane},
		]

		this.handlePaneClick = this.handlePaneClick.bind(this);
	}

	handlePaneClick(event, i) {
		this.setState({
			currPane: i
		})
	}	

	render() {
		let paneSelectors = []
		for (const i in this.panes) {
			paneSelectors.push(
				React.createElement('div', {
					className:`pane-selector-elem ${this.state.currPane == i ? "pane-selector-active" : ""}`, 
					id:`pane-selector-${i}`,
					key: i,
					onClick: (event) => this.handlePaneClick(event, i),
				}, this.panes[i].name)
			);
		}

		return [
			React.createElement('div', {id: 'pane-selector', key:0}, paneSelectors),
			React.createElement(this.panes[this.state.currPane].component, {key:1})
		]	
	}
}