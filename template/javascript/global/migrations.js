const versionHistory = [
	"1.0",
	"1.0.1"
]

const migrations = [
	v1_0ToV1_0_1
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