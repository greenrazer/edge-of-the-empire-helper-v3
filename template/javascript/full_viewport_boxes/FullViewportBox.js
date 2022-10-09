export class FullViewportBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}

		this.handleCustom = this.handleCustom.bind(this)
	}

	handleCustom(custom) {
		let discordChannelId = window.data.getPathCurrentCharacter(["settings", "discordChannelId"])
		return window.api.discordSendMessageToChannel(discordChannelId, custom);
	}

	componentDidMount() {
		// document.body.style.overflow = "hidden";
	}

	componentWillUnmount() {
		// document.body.style.overflow = "unset";
	}
}