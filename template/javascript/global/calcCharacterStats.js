export function calcCharacterStats(path, newValue) {
	if (path.length === 0) {
		return
	}

	if(window.data.currCharacterIndex < 0) {
		return
	}

	calcCharacterStatsFromCharacterId(window.data.currCharacterIndex)
}

export function calcCharacterStatsFromCharacterId(characterId) {
	let settings = window.data.get(["characters", characterId, "settings"])
	
	let wound = 0
	let strain = 0
	let soak = 0
	let ranged = 0
	let melee = 0
	let encumberance = 0
	let encumberanceVal = 0
	
	let armors = window.data.get(["characters", characterId, "armor"])
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

	let weapons = window.data.get(["characters", characterId, "weapons"])
	for (let weapon of weapons){
		if (settings["encumberanceMode"] == "max") {
			encumberance = Math.max(encumberance, weapon["encumberance"])
		}
		else{
			encumberance += weapon["encumberance"]
		}
	}

	let gears = window.data.get(["characters", characterId, "property", "gear"])
	for (let gear of gears){
		if (settings["encumberanceMode"] == "max") {
			encumberance = Math.max(encumberance, gear["encumberance"])
		}
		else{
			encumberance += gear["encumberance"]
		}
	}

	let soakBase = window.data.get(["characters", characterId, "characteristics" , settings["statsBaseCharacteristic"]["soak"], "rank"])
	soak += soakBase

	let woundsBase = window.data.get(["characters", characterId, "characteristics" , settings["statsBaseCharacteristic"]["wounds"], "rank"])
	wound += woundsBase

	let encumberanceBase = window.data.get(["characters", characterId, "characteristics" , settings["statsBaseCharacteristic"]["encumberance"], "rank"])
	encumberanceVal += encumberanceBase

	let strainBase = window.data.get(["characters", characterId, "characteristics" , settings["statsBaseCharacteristic"]["strain"], "rank"])
	strain += strainBase

	window.data.set(["characters", characterId, "stats", "soak", "base"], soak)
	window.data.set(["characters", characterId, "stats", "wounds", "base"], wound)
	window.data.set(["characters", characterId, "stats", "strain", "base"], strain)
	window.data.set(["characters", characterId, "stats", "defense", "melee", "base"], melee)
	window.data.set(["characters", characterId, "stats", "defense", "ranged", "base"], ranged)
	window.data.set(["characters", characterId, "stats", "encumberance", "base"], encumberanceVal)
	window.data.set(["characters", characterId, "stats", "encumberance", "currentBase"], encumberance)
}