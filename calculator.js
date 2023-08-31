const calcDisplayMain = document.querySelector('.display-main');
const calcDisplaySub = document.querySelector('.display-sub');
const calcButtons = document.querySelectorAll('.all-buttons');
const numberButtons = document.querySelectorAll('.calc .number');
const operatorButtons = document.querySelectorAll('.calc .operator');

const clearButton = document.querySelector('.calc .clear');
const posNegButton = document.querySelector('.calc .posneg');
const exponentButton = document.querySelector('.calc .power'); 
const plusButton = document.querySelector('.btn-plus');
const minusButton = document.querySelector('.btn-minus');
const multiplyButton = document.querySelector('.btn-mult');
const divideButton = document.querySelector('.btn-divide');
const equalsButton = document.querySelector('.btn-equals');

let value1 = '';
let value2 = '';
let operator = '';
let result = '';
let error = false;

let symbols = {
  add: '+',
  subtract: '-',
  multiply: '×',
  divide: '÷',
};

let operatorFunctions = {
  'add': add,
  'subtract': subtract,
  'multiply': multiply,
  'divide': divide,
}

numberButtons.forEach((btn) => btn.addEventListener('click', (e) => {
  if (error === true) initialize();
  if (calcDisplayMain.textContent.length <= 8) {
    if (btn.dataset.value === '.') {
      if (!calcDisplayMain.textContent.includes('.')) {
        if (!calcDisplayMain.textContent) {
          calcDisplayMain.textContent += "0.";
        } else {
          calcDisplayMain.textContent += ".";
        }
      }
    } else {
      calcDisplayMain.textContent += btn.dataset.value;
    }
  };
}));

operatorButtons.forEach((btn) => btn.addEventListener('click', (e) => {

  if (value1 && value2 && result) {
    operator = operatorFunctions[e.target.dataset.func];
    value1 = parseFloat(result);

  } else if (!value1) {
    operator = operatorFunctions[e.target.dataset.func];
    value1 = parseFloat(calcDisplayMain.textContent);

  } else if (value1 && !value2) {
    value2 = calcDisplayMain.textContent ? parseFloat(calcDisplayMain.textContent) : value1;
    if (value2) value1 = operate(value1, value2, operator);
    operator = operatorFunctions[e.target.dataset.func];
  };

  value2 = '';
  result = '';
  if (value1) updateDisplay(`${value1} ${symbols[operator.name]} ${value2}`, result);
}));

clearButton.addEventListener('click', () => {
  initialize();
});

equalsButton.addEventListener('click', () => {
  value2 = !result && calcDisplayMain.textContent ?
    parseFloat(calcDisplayMain.textContent) : value2;
  value1 = result ? result : value1;

  if (operator && calcDisplayMain.textContent) operate(value1, value2, operator);
});

function initialize() {
  updateDisplay()
  value1 = '';
  value2 = '';
  operator = '';
  result = '';
  error = false;
};

function updateDisplay(sub, main) {
  calcDisplaySub.textContent = sub;
  calcDisplayMain.textContent = main;;
};

function round(int, places=6) {
  return Math.round(int * (10 ** places))/(10 ** places)
};

function add(a, b) {
  return a + b;
};

function subtract(a, b) {
  return a - b;
};

function multiply(a, b) {
  return a * b;
};

function divide(a, b) {
  if (b != 0) {
    return a / b;
  } else {
    updateDisplay(`>:(`,"...");
  };
};

function operate(val1, val2, operator) {
  result = round(operator(val1, val2));
  result = result.toString().length > 9 ? result.toExponential(5) : result;
  
  if (!isNaN(result)) {
    updateDisplay(`${val1} ${symbols[operator.name]} ${val2}`, result);
    return result;
  } else if (isNaN(result)) {
    error = true;
    result = '';
    value1 = '';
    value2 = '';
    operator = '';
  };
}