import {TextAreaCharacterDataInput} from "../data_components/TextAreaCharacterDataInput.js";

export class NotesPane extends React.Component {
	render() {
		return React.createElement('div', {id:"notes-pane", className:"pane"},
			React.createElement(TextAreaCharacterDataInput, {className:"span-col-twelve-grid-whole", characterDataPath: ["notes"], id:"notes", name:"Notes"}),
		)
	}
}