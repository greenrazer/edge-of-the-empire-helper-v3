import {DataHolder} from "./global/DataHolder.js"
import {CharacterSelectorHolder} from "./characterSelector.js"
import {MainContent} from "./mainContent.js"
import { GlobalSettings } from "./full_viewport_boxes/GlobalSettings.js";

window.data = new DataHolder()
			
function refreshAllData() {
	return window.api.getAllData().then((value) => {
		window.data.setData(value)
	});
}

function renderPage() {
	let q = 0
	let renderArray = [
		React.createElement(CharacterSelectorHolder, {key: q++}),
		React.createElement(MainContent, {key: q++})
	]
	
	
	const domContainer = document.getElementById('react-dom-container');
	const root = ReactDOM.createRoot(domContainer);
	root.render(renderArray);
}

// window.addEventListener("beforeunload", function (e) {
// 	if (window.data)
// 	var confirmationMessage = 'It looks like you have been editing something. '
// 													+ 'If you leave before saving, your changes will be lost.';

// 	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
// 	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
// });

refreshAllData().then(() => renderPage()).catch((err) => {
	alert("Invalid path in global settings.")
	const domContainer = document.getElementById('react-dom-container');
	const root = ReactDOM.createRoot(domContainer);
	root.render(React.createElement(GlobalSettings, {
		removeSelf: () => {
			location.reload()
		}
	}));
})


