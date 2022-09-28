import { addObjectsTo, diceObjectToRollString, polyDiceObjectToRollString } from "./utils.js"
import { randomChoice } from "./utils.js"

const SUCCESS = 's'
const FAILURE = 'f'
const ADVANTAGE = '+'
const DISADVANTAGE = '-'
const TRIUMPH = 't'
const DISPAIR = 'd'
const LIGHT_SIDE = 'o'
const DARK_SIDE = 'x'


const EOTE_DICE = {
	blue: [[], [], [SUCCESS], [ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE]],
	green: [[], [SUCCESS], [SUCCESS], [ADVANTAGE], [ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [SUCCESS, SUCCESS]],
	yellow: [[], [TRIUMPH], [SUCCESS], [SUCCESS], [ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE, ADVANTAGE], [ADVANTAGE, ADVANTAGE]],
	black:[[], [], [FAILURE], [FAILURE], [DISADVANTAGE], [DISADVANTAGE]],
	purple:[[], [FAILURE], [DISADVANTAGE], [DISADVANTAGE], [DISADVANTAGE], [FAILURE, FAILURE], [FAILURE, DISADVANTAGE], [DISADVANTAGE, DISADVANTAGE]],
	red: [[], [DISPAIR], [FAILURE], [FAILURE], [DISADVANTAGE], [DISADVANTAGE], [FAILURE, FAILURE], [FAILURE, FAILURE], [DISADVANTAGE, DISADVANTAGE], [DISADVANTAGE, DISADVANTAGE], [FAILURE, DISADVANTAGE], [FAILURE, DISADVANTAGE]],
	white: [[LIGHT_SIDE], [LIGHT_SIDE], [LIGHT_SIDE, LIGHT_SIDE], [LIGHT_SIDE, LIGHT_SIDE], [LIGHT_SIDE, LIGHT_SIDE], [DARK_SIDE], [DARK_SIDE], [DARK_SIDE], [DARK_SIDE], [DARK_SIDE], [DARK_SIDE], [DARK_SIDE, DARK_SIDE]]
}

export class DiceRollSimulator {
	static rollDieNTimes(die, n) {
		let outs = []
		for(let i = 0; i < n; i++){
			let output = randomChoice(die)
			for (let o of output){
				outs.push(o)
			}
		}
		return outs
	}

	static rollPolyDieNTimes(sides, n){
		let outs = []
		for(let i = 0; i < n; i++){
			outs.push(Math.ceil(Math.random() * sides))
		}
		return outs
	}

	static roll(dice) {
		let out = {}

		out[SUCCESS] = 0
		out[FAILURE] = 0
		out[ADVANTAGE] = 0
		out[DISADVANTAGE] = 0
		out[TRIUMPH] = 0
		out[DISPAIR] = 0
		out[LIGHT_SIDE] = 0
		out[DARK_SIDE] = 0

		if(dice.green && dice.green > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.green, dice.green)
			for (let o of output){
				out[o] += 1
			}
		}

		if(dice.yellow && dice.yellow > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.yellow, dice.yellow)
			for (let o of output){
				out[o] += 1
			}
		}

		if(dice.blue && dice.blue > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.blue, dice.blue)
			for (let o of output){
				out[o] += 1
			}
		}
	
		if(dice.purple && dice.purple > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.purple, dice.purple)
			for (let o of output){
				out[o] += 1
			}
		}

		if(dice.red && dice.red > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.red, dice.red)
			for (let o of output){
				out[o] += 1
			}
		}
	
		if(dice.black && dice.black > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.black, dice.black)
			for (let o of output){
				out[o] += 1
			}
		}
	
		if(dice.white && dice.white > 0) {
			let output = this.rollDieNTimes(EOTE_DICE.white, dice.white)
			for (let o of output){
				out[o] += 1
			}
		}

		return out
	}

	static polyRoll(polyDice){
		let out = []

		for (let p in polyDice) {
			let rolls = this.rollPolyDieNTimes(polyDice[p].sides, polyDice[p].quantity)
			out.push({
				rolls: rolls,
				sum:rolls.reduce((a,b) => a + b, 0),
			})
		}

		return out
	}

	static combineResults(rollOutput){
		return {
			success: rollOutput[SUCCESS] - rollOutput[FAILURE],
			advantage: rollOutput[ADVANTAGE] - rollOutput[DISADVANTAGE],
			triumph: rollOutput[TRIUMPH]- rollOutput[DISPAIR],
			light: rollOutput[LIGHT_SIDE],
			dark: rollOutput[DARK_SIDE]
		}
	}

	static DebugStats(dice, n = 1000) {
		let objs = {}
		for (let i = 0; i < n; i++) {
			let data = this.roll(dice)
			addObjectsTo(objs, data)
		}

		let stats = {}

		for (let i in objs){
			let data = objs[i]
			let mean = data.reduce((a,b)=>a+b, 0)/n
			let variance = data.map((a) => Math.pow(a-mean,2)/(n-1)).reduce((a,b)=>a+b, 0)
			stats[i] = {
				mean: mean,
				variance: variance,
			}
		}

		let statsFinal = {}

		statsFinal.success = {
			mean: Math.round((stats[SUCCESS].mean - stats[FAILURE].mean).toFixed(2)),
			std: Math.round((Math.sqrt(stats[SUCCESS].variance + stats[FAILURE].variance)).toFixed(2)),
		}
		statsFinal.advantage = {
			mean: Math.round((stats[ADVANTAGE].mean - stats[DISADVANTAGE].mean).toFixed(2)),
			std: Math.round((Math.sqrt(stats[ADVANTAGE].variance + stats[DISADVANTAGE].variance)).toFixed(2)),
		}
		statsFinal.triumph = {
			mean: Math.round((stats[TRIUMPH].mean - stats[DISPAIR].mean).toFixed(2)),
			std: Math.round((Math.sqrt(stats[TRIUMPH].variance + stats[DISPAIR].variance)).toFixed(2)),
		}
		statsFinal.lightSide = {
			mean: Math.round((stats[LIGHT_SIDE].mean - stats[DARK_SIDE].mean).toFixed(2)),
			std: Math.round((Math.sqrt(stats[LIGHT_SIDE].variance + stats[DARK_SIDE].variance)).toFixed(2)),
		}

		let diceString = diceObjectToRollString(dice);

		console.log("-------------------------------------------------")
		console.log(diceString == '!r' ?  "No Dice Rolled." : `Stats For Roll "${diceString}":`)
		if (statsFinal.success.mean != 0 || statsFinal.success.std != 0){
			console.log(statsFinal.success.mean >= 0 ? `Average Success: ${statsFinal.success.mean} (70% chance of being +/-)${statsFinal.success.std}` : `Average Failure: ${-statsFinal.success.mean} (70% chance of being +/-)${statsFinal.success.std}`)
		}
		if (statsFinal.advantage.mean != 0 || statsFinal.advantage.std != 0){
			console.log(statsFinal.advantage.mean >= 0 ? `Average Advantage: ${statsFinal.advantage.mean} (70% chance of being +/-)${statsFinal.advantage.std}` : `Average Disadvantage: ${-statsFinal.advantage.mean} (70% chance of being +/-)${statsFinal.advantage.std}`)
		}
		if (statsFinal.triumph.mean != 0 || statsFinal.triumph.std != 0){
			console.log(statsFinal.triumph.mean >= 0 ? `Average Triumph: ${statsFinal.triumph.mean} (70% chance of being +/-)${statsFinal.triumph.std}` : `Average Triumph: ${-statsFinal.triumph.mean} (70% chance of being +/-)${statsFinal.triumph.std}`)
		}
		if (statsFinal.lightSide.mean != 0 || statsFinal.lightSide.std != 0){
			console.log(statsFinal.lightSide.mean >= 0 ? `Average Light Side: ${statsFinal.lightSide.mean} (70% chance of being +/-)${statsFinal.lightSide.std}` : `Average Dark Side: ${-statsFinal.lightSide.mean} (70% chance of being +/-)${statsFinal.lightSide.std}`)
		}
		console.log("-------------------------------------------------")
	}

	static DebugPolyStats(polyDice, n = 1000){
		// let objs = {}
		// for (let i = 0; i < n; i++) {
		// 	let data = this.polyRoll(polyDice)
		// 	addObjectsTo(objs, data)
		// }

		// let stats = {}

		// for (let i in objs){
		// 	let data = objs[i]
		// 	let mean = data.reduce((a,b)=>a+b, 0)/n
		// 	let std = Math.sqrt(data.map((a) => Math.pow(a-mean,2)/(n-1)).reduce((a,b)=>a+b, 0))
		// 	stats[i] = {
		// 		mean: mean,
		// 		std: std,
		// 	}
		// }

		// let diceString = polyDiceObjectToRollString(polyDice);

		// console.log("-------------------------------------------------")
		// console.log(diceString == '!poly' ?  "No Poly Dice Rolled." : `Stats For Poly Roll "${diceString}":`)
		// for (let i in stats) {
		// 	console.log(`Average for ${polyDice[i]}d${i}: ${Math.round(stats[i].mean.toFixed(2))} (+/-)${Math.round(stats[i].std.toFixed(2))}`)
		// }
		// console.log("-------------------------------------------------")
	}


}