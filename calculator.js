const calculator = document.querySelector('.calculator');

const calcDisplayMain = document.querySelector('.display-main');
const calcDisplaySub = document.querySelector('.display-sub');
const calcKeys = document.querySelector('.all-buttons');
const allButtons = document.querySelectorAll('.calc .btn');
const numberButtons = document.querySelectorAll('.calc .number');
const operatorButtons = document.querySelectorAll('.calc .operator');

// const clearButton = document.querySelector('.calc .clear');
const posNegButton = document.querySelector('.calc .posneg');
const exponentButton = document.querySelector('.calc .power'); 
const plusButton = document.querySelector('.btn-plus');
const minusButton = document.querySelector('.btn-minus');
const multiplyButton = document.querySelector('.btn-mult');
const divideButton = document.querySelector('.btn-divide');
const equalsButton = document.querySelector('.btn-equals');

// let valueOne = '';
// let valueTwo = '';
// let operator = '';
// let result = '';
// let error = false;
// let lastPressedKeyType;

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

const createResultString = (key, displayedValue, state) => {
  const keyValue = key.textContent;
  const keyType = key.dataset.type;
  const lastPressedKeyType = state.lastPressedKeyType
  const valueOne = state.valueOne;
  const operator = state.operator;
  const modValue = state.modValue;

  if (keyType === 'number') {
    return displayedValue.length < 9 &&
      displayedValue === '0' ||
      lastPressedKeyType === 'operator' ||
      lastPressedKeyType === 'equals'
      ? keyValue
      : displayedValue + keyValue
  };
  if (keyType === 'decimal') {
    if (!displayedValue.includes('.')) return displayedValue + keyValue;
    if (lastPressedKeyType === 'operator' || lastPressedKeyType === 'equals') return '0.';
    return displayedValue;
  };
  if (keyType === 'operator') {
    return operator &&
      valueOne &&
      lastPressedKeyType != 'operator' &&
      lastPressedKeyType != 'equals'
      ? operate(valueOne, displayedValue, operator)
      : displayedValue;
  };
  if (keyType === 'clear') {
    return '0';
  };
  if (keyType === 'equals') {
    if (valueOne) {
      return (lastPressedKeyType === 'equals')
        ? operate(displayedValue, modValue, operator)
        : operate(valueOne, displayedValue, operator)
    };
    return displayedValue;
  };
};

const updateCalculatorState = (key, displayedValue, calculatedValue, calculator) => {
  const keyType = key.dataset.type;
  const modValue = calculator.dataset.modValue;
  const action = key.dataset.func;
  const operator = calculator.dataset.operator;
  const valueOne = calculator.dataset.valueOne;
  const lastPressedKeyType = calculator.dataset.lastPressedKeyType;
  Array.from(key.parentNode.children).forEach(key => key.classList.remove('is-pressed'));
  
  if (keyType === 'operator') {
    if (lastPressedKeyType === 'operator') {
      
    }
    key.classList.add('is-pressed')
    calculator.dataset.operator = action
    calculator.dataset.valueOne = operator &&
      valueOne &&
      lastPressedKeyType != 'operator' &&
      lastPressedKeyType != 'equals'
      ? calculator.dataset.valueOne = calculatedValue
      : calculator.dataset.valueOne = displayedValue;

  };
  if (keyType === 'equals') {
    calculator.dataset.modValue = valueOne && lastPressedKeyType === 'equals'
      ? modValue
      : displayedValue
  };
  if (keyType === 'clear') {

    if (key.textContent === 'AC') {
      calculator.dataset.valueOne = '';
      calculator.dataset.modValue = '';
      calculator.dataset.operator = '';
      calculator.dataset.lastPressedKeyType = '';

    } else {
      key.textContent = 'AC';
    }
    error = false;
    calcDisplayMain.textContent = '0';
    
  };

  if (keyType != 'clear') {
    const clearButton = calculator.querySelector('[data-type=clear]');
    clearButton.textContent = 'C';
  };
  calculator.dataset.lastPressedKeyType = keyType;
};

calcKeys.addEventListener('click', (e) => {
  if (!e.target.matches('span')) return 
  const key = e.target;
  const displayedValue = calcDisplayMain.textContent;
  const resultString = createResultString(key, displayedValue, calculator.dataset)
  calcDisplayMain.textContent = resultString;

  updateCalculatorState(key, displayedValue, resultString, calculator)
});

function updateDisplay(sub, main) {
  calcDisplaySub.textContent = sub;
  calcDisplayMain.textContent = main;
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

function operate(n1, n2, operator) {
  const operatorFunc = operatorFunctions[operator]
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  result = round(operatorFunc(firstNum, secondNum));
  return result.toString().length > 9 ? result.toExponential(5) : result;
}