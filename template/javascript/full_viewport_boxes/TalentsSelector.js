import { TalentTreeDataInput } from "../data_components/TalentTreeDataInput.js";
import { FullViewportBox } from "./FullViewportBox.js"

export class TalentsSelector extends FullViewportBox {
	constructor(props) {
		super(props);

		this.state.careerSelected = -1
		this.state.specializationSelected = -1

		this.state.talentTrees = window.data.get(["talentTrees"])

		this.state.careerNames = this.state.talentTrees
			.map( item => item["career"])
			.filter((value, index, self) => {
				return self.indexOf(value) === index;
			});

		this.state.specializationNames = []

		this.state.selectedCareerPath = ["characters", this.props.characterId, "base", "career"]
		this.state.selectedCareer = window.data.get(this.state.selectedCareerPath)

		this.state.selectedSpecializationsPath = ["characters", this.props.characterId, "base", "specializations"]
		this.state.selectedSpecializations = window.data.get(this.state.selectedSpecializationsPath)

		this.dataHandler = (path, newValue) => {
			this.setState({
				selectedCareer: window.data.get(this.state.selectedCareerPath),
				selectedSpecializations: window.data.get(this.state.selectedSpecializationsPath)
			})
		}

		window.data.addListener(this.state.selectedCareerPath, this.dataHandler)
		window.data.addListener(this.state.selectedSpecializationsPath, this.dataHandler)

		this.handleOpenCareer = this.handleOpenCareer.bind(this)
		this.handleOpenSpecialization = this.handleOpenSpecialization.bind(this)
		this.handleSelectCareer = this.handleSelectCareer.bind(this)
		this.handleSelectSpecialization = this.handleSelectSpecialization.bind(this)
		this.hasCareer = this.hasCareer.bind(this)
		this.hasSpecialization = this.hasSpecialization.bind(this)
	}

	componentWillUnmount() {
		window.data.removeListener(this.state.selectedCareerPath, this.dataHandler)
		window.data.removeListener(this.state.selectedSpecializationsPath, this.dataHandler)
	}

	handleOpenCareer(i) {
		let specializationNames = this.state.talentTrees
			.filter((value) => value["career"] === this.state.careerNames[i])
			.map( (item, index) => {
				return {
					name: item["specialization"], 
					career: item["career"],
					index: index,
				}
			})
			.filter((value, index, self) => self.findIndex((item) => item.name == value.name) === index);
			
		this.setState({
			specializationNames: specializationNames,
			careerSelected: i
		})
	}

	handleOpenSpecialization(i) {
		this.setState({
			specializationSelected: i
		})
	}

	handleSelectCareer(event, i) {
		window.data.set(this.state.selectedCareerPath, this.state.careerNames[i])
	}

	handleSelectSpecialization(event, i) {
		let specializationData = this.state.specializationNames[i]
		if (event.target.checked){
			window.data.push(this.state.selectedSpecializationsPath, {
				"name": specializationData.name, 
				"career": specializationData.career
			})
		}
		else {
			window.data.removeWithFunction(this.state.selectedSpecializationsPath, (item) => {
				return item["name"] == specializationData.name && item["career"] == specializationData.career
			})
		}
	}

	hasCareer(i) {
		return this.state.selectedCareer == this.state.careerNames[i]
	}

	hasSpecialization(i) {
		let specializationData = this.state.specializationNames[i]
		return this.state.selectedSpecializations.some(item => {
			return item["name"] == specializationData.name && item["career"] == specializationData.career
		})
	}

	render() {
		let careerNames = []

		for(let i = 0; i < this.state.careerNames.length; i++){
			let elem = React.createElement('div', {style:{position: "relative", height: "50px"},key:i},
			React.createElement('input',{type:"checkbox", className:"width-25-percent-float-left", onChange:(event) => this.handleSelectCareer(event, i), checked:this.hasCareer(i) }),
				React.createElement('span', {className:"width-25-percent-float-left"}, this.state.careerNames[i]),
				React.createElement('button',{className:"width-25-percent-float-left",onClick:(event) => this.handleOpenCareer(i) }, "Open")
			)
			careerNames.push(elem)
		}

		let specializationNames = []

		if (this.state.careerSelected < 0){
			specializationNames = React.createElement('span', {}, "No Career Selected.")
		}
		else {
			for(let i = 0; i < this.state.specializationNames.length; i++){
				let elem = React.createElement('div', {style:{position: "relative", height: "50px"},key:i},
					React.createElement('input',{type:"checkbox", className:"width-25-percent-float-left", onChange:(event) => this.handleSelectSpecialization(event, i), checked:this.hasSpecialization(i) }),
					React.createElement('span', {className:"width-25-percent-float-left"}, this.state.specializationNames[i].name),
					React.createElement('button',{className:"width-25-percent-float-left",onClick:(event) => this.handleOpenSpecialization(this.state.specializationNames[i].index) }, "Open")
				)
				specializationNames.push(elem)
			}
		}

		return React.createElement('div', {className: "on-top"}, 
			React.createElement('div', {className:"full-screen-semi-transparent-background"}),
			React.createElement('div', {id:"top-level-box-big", className:"fixed-centered"},
				React.createElement('div', {className: "height-97"},
					React.createElement('div', {id:"careers-name", className:"left-25"}, 
						React.createElement('div', {className: "full-height-container"},
							careerNames
						)
					),
					React.createElement('div', {id:"careers-name", className:"left-25"}, 
						React.createElement('div', {className: "full-height-container"},
							specializationNames
						)
					),
					React.createElement('div', {id:"force-powers-tree", className:"right-75"}, 
						this.state.specializationSelected < 0 ? "No Tree Selected" : React.createElement(TalentTreeDataInput, {characterId: this.props.characterId, treeId: this.state.specializationSelected})
					),
				),
				React.createElement('button', {onClick: this.props.removeSelf, className: "", title:"Ok"}, "Ok"),
			)
		)
	}
}