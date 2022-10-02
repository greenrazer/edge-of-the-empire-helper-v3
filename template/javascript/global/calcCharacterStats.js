export function calcCharacterStats(path, newValue) {
	if (path.length === 0) {
		return
	}

	if(window.data.currCharacterIndex < 0) {
		return
	}

	let settings = window.data.getPathCurrentCharacter(["settings"])
	
	let wound = 0
	let strain = 0
	let soak = 0
	let ranged = 0
	let melee = 0
	let encumberance = 0
	let encumberanceVal = 0
	
	let armors = window.data.getPathCurrentCharacter(["armor"])
	for (let armor of armors){
		soak += armor["soak"]
		melee += armor["defense"]["melee"]
		ranged += armor["defense"]["ranged"]
		if (settings["encumberanceMode"] == "max") {
			encumberance = Math.max(encumberance, armor["encumberance"])
		}
		else{
			encumberance += armor["encumberance"]
		}
	}

	let weapons = window.data.getPathCurrentCharacter(["weapons"])
	for (let weapon of weapons){
		if (settings["encumberanceMode"] == "max") {
			encumberance = Math.max(encumberance, weapon["encumberance"])
		}
		else{
			encumberance += weapon["encumberance"]
		}
	}

	let gears = window.data.getPathCurrentCharacter(["property", "gear"])
	for (let gear of gears){
		if (settings["encumberanceMode"] == "max") {
			encumberance = Math.max(encumberance, gear["encumberance"])
		}
		else{
			encumberance += gear["encumberance"]
		}
	}

	let brawn = window.data.getPathCurrentCharacter(["characteristics" , "brawn", "rank"])
	soak += brawn
	wound += brawn
	encumberanceVal += brawn + 5

	let willpower = window.data.getPathCurrentCharacter(["characteristics" , "willpower", "rank"])
	strain += willpower

	window.data.setPathCurrentCharacter(["stats", "soak", "base"], soak)
	window.data.setPathCurrentCharacter(["stats", "wounds", "base"], wound)
	window.data.setPathCurrentCharacter(["stats", "strain", "base"], strain)
	window.data.setPathCurrentCharacter(["stats", "defense", "melee", "base"], melee)
	window.data.setPathCurrentCharacter(["stats", "defense", "ranged", "base"], ranged)
	window.data.setPathCurrentCharacter(["stats", "encumberance", "base"], encumberanceVal)
	window.data.setPathCurrentCharacter(["stats", "encumberance", "currentBase"], encumberance)
}