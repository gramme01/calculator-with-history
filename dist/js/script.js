(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyValueGetter = keyValueGetter;
exports.addToExp = addToExp;
exports.setDisplay = setDisplay;
exports.getDisplay = getDisplay;
exports.expCharLengthExceeded = expCharLengthExceeded;
exports.clear = clear;

function keyValueGetter(key) {
  var keyValuelog = key.dataset.value;
  return keyValuelog;
}

function addToExp(item, location) {
  location.textContent += item;
}

function setDisplay(node, item) {
  node.textContent = item;
}

function getDisplay(node) {
  return node.textContent;
}

function expCharLengthExceeded(exp, limit) {
  if (exp.length >= limit) {
    return true;
  }
}

function clear(display) {
  setDisplay(display, "");
}

},{}],2:[function(require,module,exports){
"use strict";

var _calcModules = require("./calc-modules");

var _theme = _interopRequireDefault(require("./theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
|--------------------------------------------------
| INITS
|--------------------------------------------------
*/
var solution = null;
var historyLog = [];
(0, _theme.default)();
/**
|--------------------------------------------------
| CACHE DOM
|--------------------------------------------------
*/

var keys = document.querySelectorAll("[data-value]");
var clearBtn = document.querySelector("[data-value = 'clear']");
var displayExp = document.querySelector(".calc__expression");
var historyLogDisplay = document.querySelector(".history__content");
var displayAns = document.querySelector(".calc__answer");
/**
|--------------------------------------------------
|KEYPRESS FUNCTIONS
|--------------------------------------------------
*/

var evaluate = function evaluate() {
  var _getExpArray = getExpArray(),
      _getExpArray2 = _slicedToArray(_getExpArray, 3),
      expArray = _getExpArray2[0],
      currentNum = _getExpArray2[1],
      exp = _getExpArray2[2]; // const fractionExp = fractionalize(expArray);


  var mathExp = exp.replace(/x/g, "*").replace(/÷/g, "/");
  var answer;

  if (currentNum === "" || currentNum[currentNum.length - 1] === ".") {
    //stop useless equal to (after sign and decimal)
    return;
  }

  createHistory(exp);
  solution = eval(mathExp).toString();
  console.log(_typeof(solution));

  if ((0, _calcModules.expCharLengthExceeded)(solution, 8)) {
    answer = Number(solution).toExponential(6);
    console.log("object");
  } else {
    answer = solution;
  }

  (0, _calcModules.setDisplay)(displayAns, answer);
  (0, _calcModules.clear)(displayExp);
};

var backspace = function backspace() {
  var exp = (0, _calcModules.getDisplay)(displayExp);
  var operators = ["+", "-", "x", "÷", "%", " "];

  do {
    exp = exp.substr(0, exp.length - 1);
  } while (operators.includes(exp[exp.length - 1]));

  (0, _calcModules.setDisplay)(displayExp, exp);
};

var displayPressedKey = function displayPressedKey(key, check) {
  var value = (0, _calcModules.keyValueGetter)(key);
  var item = keyPositionCheck(value, check);
  (0, _calcModules.addToExp)(item ? item : "", displayExp);
};

var keyPositionCheck = function keyPositionCheck(value, type) {
  var _getExpArray3 = getExpArray(),
      _getExpArray4 = _slicedToArray(_getExpArray3, 3),
      expArray = _getExpArray4[0],
      currentNum = _getExpArray4[1],
      exp = _getExpArray4[2];

  var length = expArray.length;
  var firstPressedKey = expArray[0] === "" && length === 1;
  var firstChar = currentNum.length === 0; //first character of expression

  var expNoSpace = exp.replace(/\s+/g, "");
  var item;

  if ((0, _calcModules.expCharLengthExceeded)(expNoSpace, 16)) {
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
        item = solution ? "".concat(solution, " ").concat(value, " ") : null;
      } //handle operators pressed after another operator


      if (currentNum === "" && length > 1) {
        var prevSign = expArray[length - 2];

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

        var updatedDisplay = expArray.join(" ");
        (0, _calcModules.setDisplay)(displayExp, updatedDisplay);
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
      if (firstChar || expArray.length === 3 && expArray[1] === "-") {
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
    (0, _calcModules.clear)(displayAns);
  }

  return item;
};
/**
|--------------------------------------------------
| HISTORY FUNCTIONS
|--------------------------------------------------
*/


var createHistory = function createHistory(exp) {
  if (historyLog[0] === exp) {
    return;
  } else {
    historyLog.unshift(exp);
    addHistoryEntry(historyLogDisplay);
  }
};

var addHistoryEntry = function addHistoryEntry() {
  var first = historyLogDisplay.firstElementChild;
  var last = historyLogDisplay.lastElementChild;
  var p = document.createElement("p");
  p.innerHTML = historyLog[0];
  p.classList.add("history__entry");
  p.addEventListener("click", loadHistory);
  historyLogDisplay.insertBefore(p, first);

  if (historyLogDisplay.childElementCount > 10) {
    historyLogDisplay.removeChild(last);
  }
};

var removeHistoryEntry = function removeHistoryEntry() {
  var children = historyLogDisplay.children;
  var num = historyLogDisplay.childElementCount;
  console.log(historyLogDisplay);

  for (var i = 0; i < num; i++) {
    children[i].removeEventListener("click", loadHistory);
  }
};

var loadHistory = function loadHistory(e) {
  var exp = e.target.textContent;
  (0, _calcModules.setDisplay)(displayExp, exp);
  (0, _calcModules.clear)(displayAns);
};

var clearHistory = function clearHistory() {
  (0, _calcModules.clear)(displayExp);
  (0, _calcModules.setDisplay)(displayAns, "0");

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


var getExpArray = function getExpArray() {
  var exp = (0, _calcModules.getDisplay)(displayExp);
  var expArray = exp.split(" ");
  var currentNum = expArray[expArray.length - 1];
  return [expArray, currentNum, exp];
};
/**
|--------------------------------------------------
| EVENT
|--------------------------------------------------
*/


var keyOperation = function keyOperation(key) {
  switch (key.dataset.value) {
    case "=":
      evaluate();
      break;

    case "clear":
      (0, _calcModules.clear)(displayExp);
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
}; //key press


keys.forEach(function (key) {
  key.addEventListener("click", function () {
    return keyOperation(key);
  });
}); //doubleclick trash

clearBtn.addEventListener("dblclick", clearHistory);

},{"./calc-modules":1,"./theme":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeInitializer = exports.persistTheme = void 0;

var persistTheme = function persistTheme(theme) {
  localStorage.setItem("theme", theme);
};

exports.persistTheme = persistTheme;

var themeInitializer = function themeInitializer(element, control) {
  var savedTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;

  if (savedTheme) {
    element.setAttribute("data-theme", savedTheme);

    if (savedTheme === "light") {
      control.checked = true;
    }
  }
};

exports.themeInitializer = themeInitializer;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = themeHandler;

var _themeModules = require("./theme-modules");

function themeHandler() {
  var app = document.documentElement;
  var themeSwitch = document.getElementsByClassName("theme-toggler__checkbox")[0];
  (0, _themeModules.themeInitializer)(app, themeSwitch);

  var toggleTheme = function toggleTheme(e) {
    if (e.target.checked) {
      app.setAttribute("data-theme", "light");
      (0, _themeModules.persistTheme)("light");
    } else {
      app.setAttribute("data-theme", "dark");
      (0, _themeModules.persistTheme)("dark");
    }
  };

  themeSwitch.addEventListener("change", toggleTheme, false);
}

},{"./theme-modules":3}]},{},[2]);

//# sourceMappingURL=script.js.map
