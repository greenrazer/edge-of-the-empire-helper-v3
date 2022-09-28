export class AmountPicker extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			value: this.props.value,
			boxes: this.props.boxes || 5,
		}
	}

	handleChange(event, val) {
		this.setState({
			value: val
		})
		event.target.value = val
		this.props.onChange(event)
	}

	render() {
		let arr = []

		for( let i = 1; i <= this.state.boxes; i++) {
			let elem = React.createElement("i", {
				id: this.props.id + "-" + i,
				className: i <= this.state.value  ? `mf mf-${this.props.shape}` : `mf mf-${this.props.shape}-o`,
				style: {color:this.props.color},
				onClick: (event) => this.handleChange(event, i),
				key: i
			})
			arr.push(elem)
		}

		let i = 0
		return React.createElement("div", null, 
			React.createElement("span", null, this.props.name + ":"), 
			React.createElement("span", {}, 
				React.createElement("i", {
					id: this.props.id + "-0",
					className: "mf mf-ban",
					onClick: (event) => this.handleChange(event, 0)
				}),
				arr
			)
		)
	}
}