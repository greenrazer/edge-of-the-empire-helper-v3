export class ForceTreeDataInput extends React.Component{
	constructor(props){
		super(props)
		
		let treePath = ["forcePowerTrees", props.treeId]
		let initTreeData = window.data.get(treePath)
		let initForcePowers;
		if (window.data.has(["characters", this.props.characterId, "forcePowers", initTreeData["name"]])){
			initForcePowers = window.data.get(["characters", this.props.characterId, "forcePowers", initTreeData["name"]])
		}
		else {
			initForcePowers = []
		}

		let initForceRank = window.data.get(["characters", this.props.characterId, "characteristics", "forceRank", "rank"])

		this.state = {
			treePath: treePath,
			treeData: initTreeData,
			forcePowers: initForcePowers,
			forceRank: initForceRank
		}

		this.dataHandler = (path, newValue) => {
			let forcePowers;

			if (window.data.has(["characters", this.props.characterId, "forcePowers", this.state.treeData["name"]])){
				forcePowers = window.data.get(["characters", this.props.characterId, "forcePowers", this.state.treeData["name"]])
			}
			else {
				forcePowers = []
			}

			this.setState({
				forcePowers: forcePowers
			})
		}

		window.data.addListener(["characters", this.props.characterId, "forcePowers"], this.dataHandler)

		this.itemIsEnabled = this.itemIsEnabled.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.characterHasItem = this.characterHasItem.bind(this)
	}

	componentDidUpdate(prevProps) {
		if (!(prevProps.treeId == this.props.treeId)){
			let treePath = ["forcePowerTrees", this.props.treeId]
			let treeData = window.data.get(treePath)
			let forcePowers;
			if (window.data.has(["characters", this.props.characterId, "forcePowers", treeData["name"]])){
				forcePowers = window.data.get(["characters", this.props.characterId, "forcePowers", treeData["name"]])
			}
			else {
				forcePowers = []
			}

			this.setState({
				treePath: treePath,
				treeData: treeData,
				forcePowers: forcePowers,
			})
		}
	}

	componentWillUnmount() {
		window.data.removeListener(["characters", this.props.characterId, "forcePowers"], this.dataHandler)
	}

	itemIsEnabled(item) {
		if (this.state.forceRank < this.state.treeData["requiredRank"]) {
			return false
		}
		if (item["enabledBy"].length == 0){
			return true
		}
		for(let itemId in item["enabledBy"]){
			let hasItem = this.state.forcePowers.findIndex((element) => element["id"] == item["enabledBy"][itemId])
			if (hasItem != -1){
				return true
			}
		}
		return false
	}

	characterHasItem(itemId) {
		let index = this.state.forcePowers.findIndex((element) => element["id"] == itemId)
		return index >= 0
	}

	handleChange(event, itemId, item){
		let characterTreeDataPath = ["characters", this.props.characterId, "forcePowers", this.state.treeData["name"]]

		if(event.target.checked) {
			if (!window.data.has(characterTreeDataPath)){
				window.data.set(characterTreeDataPath, [])
			}
			window.data.push(characterTreeDataPath, {
				id: itemId,
				name: item["name"],
				description: item["description"],
				ranked: item["ranked"] == true,
				xpCost: item["xpCost"],
			})
		}
		else {
			if (window.data.has(characterTreeDataPath)){
				let index = this.state.forcePowers.findIndex((element) => element["id"] == itemId)
				if (index >= 0){
					window.data.remove(characterTreeDataPath, index)
				}
			}
		}
	}

	render() {
		let inner = []

		let q = 0
		for (let boxStyle of this.state.treeData['layout']) {
			let item = this.state.treeData["items"][boxStyle["id"]];
			let enabled = this.itemIsEnabled(item)
			let width = boxStyle["width"]
			let active = this.characterHasItem(boxStyle["id"]);

			let bottomConnections = []
			for(let i = 0; i < boxStyle["width"]; i++){
				bottomConnections.push(React.createElement('div',{key:i, className:"width-25-percent-float-left height-20-percent-min-10px", style: {width: `${100*(1/width)}%`}}, 
					boxStyle["down"].includes(i) ? React.createElement('div', {className: active ?  "centered-activated-block" : "centered-black-block"}) : null)
				)
			}

			inner.push(React.createElement('div', {
					style: {
						gridColumn: `span ${width*3}`,
						height:"200px"
					},
					key:q++
				},
				React.createElement('div', {className:"width-10-percent-float-left height-80-percent-min-15px", style:{width:"calc(10% - 13px)"}}, boxStyle["left"] ? React.createElement('div', {className:active ? "vertically-activated-center-left": "vertically-center"}): null),
				React.createElement('div', {className:"width-80-percent-float-left height-80-percent-min-15px solid-black-border padding-10"}, 
					!enabled ? React.createElement('div', null, "Requirements Not Met") : null, 
					React.createElement('div', null, item['name']),
					React.createElement('div', null, item['xpCost']),
					React.createElement('div', {className: "tree-description"}, item['description']),
					React.createElement("input", {
						type: "checkbox",
						checked: active,
						onChange: (event) => this.handleChange(event, boxStyle["id"], item),
					})
				),
				React.createElement('div', {className:"width-10-percent-float-left height-80-percent-min-15px", style:{width:"calc(10% - 13px)"}}, boxStyle["right"] ? React.createElement('div', {className:active ? "vertically-activated-center-right": "vertically-center"}): null),
				bottomConnections,
			))
		}

		return React.createElement('div', {className:"col-12-grid", style: {"gridGap":0}}, 
			inner
		)
	}

}