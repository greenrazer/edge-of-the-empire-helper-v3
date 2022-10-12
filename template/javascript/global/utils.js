export function removeItemAll(arr, value) {
	var i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
		arr.splice(i, 1);
		} else {
		++i;
		}
	}
	return arr;
}

export function copy(aObject) {
	if (!aObject) return aObject;

	let bObject = Array.isArray(aObject) ? [] : {};

	let value;
	for (const key in aObject) {
		value = aObject[key];
		bObject[key] = (typeof value === "object") ? copy(value) : value;
	}

	return bObject;
}

export function equalArray(a, b) {
    if (a.length === b.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    } else {
        return false;
	}
}

export function camelCaseToTitleCase(camelCase){
	const result = camelCase.replace(/([A-Z])/g, " $1");
	const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
	return finalResult
}

export function diceObjectToRollString(dice){
	let out = ["!r"]

	if(dice.green > 0) {
		out.push(`${dice.green}g`)
	}

	if(dice.yellow > 0) {
		out.push(`${dice.yellow}y`)
	}

	if(dice.blue > 0) {
		out.push(`${dice.blue}b`)
	}

	if(dice.purple > 0) {
		out.push(`${dice.purple}p`)
	}

	if(dice.red > 0) {
		out.push(`${dice.red}r`)
	}

	if(dice.black > 0) {
		out.push(`${dice.black}k`)
	}

	if(dice.white > 0) {
		out.push(`${dice.white}w`)
	}

	return out.join(" ")
}

export function polyDiceObjectToRollString(dice){
	let out = ["!poly"]

	for( let i in dice ){
		let str = `${dice[i].quantity}d${dice[i].sides}`
		out.push(str)
	}

	return out.join(" ")
}

export function randomChoice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export function addObjectsTo(obj, toAddObj) {
	for (let i in toAddObj) {
		if (!(i in obj)){
			obj[i] = []
		}
		obj[i].push(toAddObj[i])
	}
}

export function forcePowersObjToRenderArray(forcePowersObj){
	let nameCounter = {}
	for (let i in forcePowersObj){
		for (let j in forcePowersObj[i]){
			if (!(forcePowersObj[i][j]["name"] in nameCounter)){
				nameCounter[forcePowersObj[i][j]["name"]] = {
					"tree": i,
					"name": forcePowersObj[i][j]["name"],
					"description": forcePowersObj[i][j]["description"],
					"xpCost": 0,
					"rank": 0
				}
			}
			nameCounter[forcePowersObj[i][j]["name"]]["xpCost"] += forcePowersObj[i][j]["xpCost"]
			nameCounter[forcePowersObj[i][j]["name"]]["rank"] += 1
		}
	}

	let output = []
	
	for (let i in nameCounter) {
		output.push(nameCounter[i])
	}

	return output
}

export function talentsObjToRenderArray(talentsObj) {
	let nameCounter = {}
	for (let career in talentsObj){
		for (let specialization in talentsObj[career]){
			for(let talent in talentsObj[career][specialization]){
				let objValue = talentsObj[career][specialization][talent]
				if (!(objValue["name"] in nameCounter)){
					nameCounter[objValue["name"]] = {
						"name": objValue["name"],
						"specialization": specialization,
						"career": career,
						"description": objValue["description"],
						"xpCost": 0,
						"rank": 0
					}
				}
				nameCounter[objValue["name"]]["xpCost"] += objValue["xpCost"]
				nameCounter[objValue["name"]]["rank"] += 1
			}
		}
	}

	let output = []
	
	for (let i in nameCounter) {
		output.push(nameCounter[i])
	}

	return output
}