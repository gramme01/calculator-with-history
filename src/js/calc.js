import {
	keyValueGetter,
	addToExp,
	setDisplay,
	getDisplay,
	expCharLengthExceeded,
	clear
} from "./calc-modules";

import themeHandler from "./theme";

/**
|--------------------------------------------------
| INITS
|--------------------------------------------------
*/
let solution = null;
const historyLog = [];
themeHandler();

/**
|--------------------------------------------------
| CACHE DOM
|--------------------------------------------------
*/
const keys = document.querySelectorAll("[data-value]");
const clearBtn = document.querySelector("[data-value = 'clear']");
const displayExp = document.querySelector(".calc__expression");
const historyLogDisplay = document.querySelector(".history__content");
const displayAns = document.querySelector(".calc__answer");

/**
|--------------------------------------------------
|KEYPRESS FUNCTIONS
|--------------------------------------------------
*/

const evaluate = () => {
	const [expArray, currentNum, exp] = getExpArray();
	// const fractionExp = fractionalize(expArray);
	const mathExp = exp.replace(/x/g, "*").replace(/÷/g, "/");

	let answer;
	if (currentNum === "" || currentNum[currentNum.length - 1] === ".") {
		//stop useless equal to (after sign and decimal)
		return;
	}
	createHistory(exp);
	solution = eval(mathExp).toString();
	console.log(typeof solution);
	if (expCharLengthExceeded(solution, 8)) {
		answer = Number(solution).toExponential(6);
		console.log("object");
	} else {
		answer = solution;
	}
	setDisplay(displayAns, answer);
	clear(displayExp);
};

const backspace = () => {
	let exp = getDisplay(displayExp);
	const operators = ["+", "-", "x", "÷", "%", " "];
	do {
		exp = exp.substr(0, exp.length - 1);
	} while (operators.includes(exp[exp.length - 1]));

	setDisplay(displayExp, exp);
};

const displayPressedKey = (key, check) => {
	const value = keyValueGetter(key);
	let item = keyPositionCheck(value, check);
	addToExp(item ? item : "", displayExp);
};

const keyPositionCheck = (value, type) => {
	const [expArray, currentNum, exp] = getExpArray();
	const length = expArray.length;
	const firstPressedKey = expArray[0] === "" && length === 1;
	const firstChar = currentNum.length === 0; //first character of expression
	const expNoSpace = exp.replace(/\s+/g, "");
	let item;

	if (expCharLengthExceeded(expNoSpace, 16)) {
		return;
	}

	switch (type) {
		case "operator":
			item = " " + value + " ";
			if (currentNum[currentNum.length - 1] === ".") {
				// no operator immediately after decimal
				item = null;
			}
			if (value !== "-" && firstPressedKey) {
				//operator button other than - cannot be pressed first without invoking ans
				item = solution ? `${solution} ${value} ` : null;
			}

			//handle operators pressed after another operator
			if (currentNum === "" && length > 1) {
				const prevSign = expArray[length - 2];

				if (value === "-" && prevSign === "-") {
					// cycle + and - when - is pressed consecutively
					expArray.splice(length - 2, 2, "+");
				} else if (value === "-" && prevSign !== "+") {
					// handle negation of numbers
					expArray.push(value);
				} else {
					//replace preceding operator
					expArray.splice(length - 2, 2, value);
				}

				const updatedDisplay = expArray.join(" ");
				setDisplay(displayExp, updatedDisplay);
				item = " ";
			}
			break;

		case "decimal":
			if (firstChar) {
				item = "0.";
			} else if (currentNum.indexOf(".") === -1) {
				item = ".";
			} else {
				item = null;
			}
			break;

		case "ans":
			if (firstChar || (expArray.length === 3 && expArray[1] === "-")) {
				//firstchar or as the second pressed after -
				item = solution ? solution : null;
			} else {
				item = null;
			}
			break;

		case "zero":
			if (firstChar) {
				item = null;
			} else {
				item = value;
			}
			break;

		default:
			item = value;
			break;
	}

	if (firstPressedKey && item !== null) {
		//clear prev answer after first succesful keypress
		clear(displayAns);
	}
	return item;
};

/**
|--------------------------------------------------
| HISTORY FUNCTIONS
|--------------------------------------------------
*/
const createHistory = exp => {
	if (historyLog[0] === exp) {
		return;
	} else {
		historyLog.unshift(exp);
		addHistoryEntry(historyLogDisplay);
	}
};

const addHistoryEntry = () => {
	const first = historyLogDisplay.firstElementChild;
	const last = historyLogDisplay.lastElementChild;
	const p = document.createElement("p");
	p.innerHTML = historyLog[0];
	p.classList.add("history__entry");
	p.addEventListener("click", loadHistory);
	historyLogDisplay.insertBefore(p, first);

	if (historyLogDisplay.childElementCount > 10) {
		historyLogDisplay.removeChild(last);
	}
};

const removeHistoryEntry = () => {
	const children = historyLogDisplay.children;
	const num = historyLogDisplay.childElementCount;
	console.log(historyLogDisplay);
	for (let i = 0; i < num; i++) {
		children[i].removeEventListener("click", loadHistory);
	}
};

const loadHistory = e => {
	const exp = e.target.textContent;
	setDisplay(displayExp, exp);
	clear(displayAns);
};

const clearHistory = () => {
	clear(displayExp);
	setDisplay(displayAns, "0");
	while (historyLog.length > 0) {
		historyLog.pop();
	}
	removeHistoryEntry();
	historyLogDisplay.innerHTML = null;
	solution = null;
};

/**
|--------------------------------------------------
| OTHERS
|--------------------------------------------------
*/
const getExpArray = () => {
	const exp = getDisplay(displayExp);
	const expArray = exp.split(" ");
	const currentNum = expArray[expArray.length - 1];
	return [expArray, currentNum, exp];
};

/**
|--------------------------------------------------
| EVENT
|--------------------------------------------------
*/

const keyOperation = key => {
	switch (key.dataset.value) {
		case "=":
			evaluate();
			break;

		case "clear":
			clear(displayExp);
			break;

		case "bcksp":
			backspace();
			break;

		case "+":
		case "-":
		case "x":
		case "÷":
		case "%":
			displayPressedKey(key, "operator");
			break;

		case "ans":
			displayPressedKey(key, "ans");
			break;

		case ".":
			displayPressedKey(key, "decimal");
			break;

		case "0":
			displayPressedKey(key, "zero");
			break;

		default:
			displayPressedKey(key);
			break;
	}
};

//key press
keys.forEach(key => {
	key.addEventListener("click", () => keyOperation(key));
});

//doubleclick trash
clearBtn.addEventListener("dblclick", clearHistory);
