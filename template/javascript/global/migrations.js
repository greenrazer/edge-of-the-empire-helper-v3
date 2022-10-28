const versionHistory = [
	"1.0",
	"1.0.1",
	"1.2.0"
]

const migrations = [
	v1_0ToV1_0_1,
	v1_0_1ToV1_2_0
]

function v1_0ToV1_0_1(characterId) {
	window.data.set(["characters", characterId, "settings", "statsBaseCharacteristic"], {
		"soak": "brawn",
		"wounds": "brawn",
		"encumberance": "brawn",
		"strain": "willpower"
	})
	window.data.set(["characters", characterId, "meta", "version"], "1.0.1")
}

function v1_0_1ToV1_2_0(characterId) {
	let skills = window.data.get(["characters", characterId, "skills"])
	for (let i in skills){
		window.data.set(["characters", characterId, "skills", i, "careerRank"], 0)
		window.data.set(["characters", characterId, "skills", i, "careerActivatorCount"], 0)
	}

	let specializations = window.data.get(["characters", characterId, "base", "specializations"])
	window.data.set(["characters", characterId, "base", "customSpecializations"], specializations)
	window.data.set(["characters", characterId, "base", "specializations"], [])

	let talents = window.data.get(["characters", characterId, "talents"])
	window.data.set(["characters", characterId, "customTalents"], talents)
	window.data.set(["characters", characterId, "talents"], {})

	let forcePowers = window.data.get(["characters", characterId, "forcePowers"])
	window.data.set(["characters", characterId, "customForcePowers"], forcePowers)
	window.data.set(["characters", characterId, "forcePowers"], {})

	window.data.set(["characters", characterId, "finances", "creditsUsed"], 0)

	window.data.set(["characters", characterId, "meta", "version"], "1.2.0")
}

export function migrationNeeded(characterId){
	let characterVersion = window.data.get(["characters", characterId, "meta", "version"])
	let currentVersion = versionHistory[versionHistory.length-1]
	return characterVersion != currentVersion
}

export function migrateCharacter(characterId) {
	let characterVersion = window.data.get(["characters", characterId, "meta", "version"])
	let versionIndex = versionHistory.indexOf(characterVersion)
	if (versionIndex == -1){
		alert(`Could not migrate character, version ${characterVersion} not found in migration list`)
		return false
	}
	for (let i = versionIndex; i < migrations.length; i++){
		migrations[i](characterId)
	}
	return true
}