const calculator = document.querySelector('.calculator');

const calcDisplayMain = document.querySelector('.display-main');
const calcDisplaySub = document.querySelector('.display-sub');
const calcKeys = document.querySelector('.all-buttons');

const posNegButton = document.querySelector('.calc .posneg');
const exponentButton = document.querySelector('.calc .power'); 
const plusButton = document.querySelector('.btn-plus');
const minusButton = document.querySelector('.btn-minus');
const multiplyButton = document.querySelector('.btn-mult');
const divideButton = document.querySelector('.btn-divide');
const equalsButton = document.querySelector('.btn-equals');

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
  const errorState = state.error;
  if (errorState && !keyType === 'clear') return;

  if (keyType === 'number') {
    if (lastPressedKeyType === 'equals') {
      calcDisplaySub.textContent = updateSubDisplay(valueOne, '', operator)
    }
    if (displayedValue.length < 9) {
      return displayedValue === '0' ||
      lastPressedKeyType === 'operator' ||
      lastPressedKeyType === 'equals'
      ? keyValue
      : displayedValue + keyValue
    } else if (lastPressedKeyType === 'operator') {
      return keyValue;
    } else {
      return displayedValue;
    };
  };
  if (keyType === 'decimal') {
    if (!displayedValue.includes('.')) return displayedValue + keyValue;
    if (lastPressedKeyType === 'operator' || lastPressedKeyType === 'equals') return '0.';
    return displayedValue;
  };
  if (keyType === 'operator') {
    if (operator &&
        valueOne &&
        lastPressedKeyType != 'operator' &&
        lastPressedKeyType != 'equals') {
      let calculatedValue = operate(valueOne, displayedValue, operator)
      console.log(key.dataset.func)
      calcDisplaySub.textContent = updateSubDisplay(calculatedValue, '', key.dataset.func)
      return calculatedValue;
    } else {
      calcDisplaySub.textContent = updateSubDisplay(displayedValue, '', key.dataset.func)
    return displayedValue;
    };
  };

  if (keyType === 'clear') {
    if (keyValue === 'AC') calcDisplaySub.textContent = updateSubDisplay('', '', '')
    return '0';
  };
  if (keyType === 'equals') {
    if (valueOne) {
      if (lastPressedKeyType === 'equals') {
        calcDisplaySub.textContent = updateSubDisplay(displayedValue, modValue, operator)
        return operate(displayedValue, modValue, operator)
      } else {
        calcDisplaySub.textContent = updateSubDisplay(valueOne, displayedValue, operator)
        return operate(valueOne, displayedValue, operator)
      };
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
  const errorState = calculator.dataset.errorState;

  if (errorState && !keyType === 'clear') return;
  Array.from(key.parentNode.children).forEach(key => key.classList.remove('is-pressed'));
  
  if (keyType === 'operator') {
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
    calculator.dataset.errorState = false;
    calcDisplayMain.textContent = '0';
  };
  if (keyType != 'clear') {
    const clearButton = calculator.querySelector('[data-type=clear]');
    clearButton.textContent = 'C';
  };
  calculator.dataset.lastPressedKeyType = keyType;
};

const updateSubDisplay = (n1, n2, oper) => {
  const valueOne = n1 ? n1 : '';
  const valueTwo = n2 ? n2 : '';
  const operator = oper ? symbols[oper] : '';
  return `${valueOne} ${operator} ${valueTwo}`
}

calcKeys.addEventListener('click', e => {
  if (!e.target.matches('span') || 
  calculator.dataset.errorState === "true" && e.target.dataset.type != 'clear' ) return 
  const key = e.target;
  const displayedValue = calcDisplayMain.textContent;
  const resultString = createResultString(key, displayedValue, calculator.dataset)
  calcDisplayMain.textContent = isNaN(resultString) ? "..." : resultString;

  updateCalculatorState(key, displayedValue, resultString, calculator)
  key.classList.add('activated')
  setTimeout(() => key.classList.remove('activated'), 50)
});

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
    calcDisplayMain.textContent = "..."
    calcDisplaySub.textContent = ">:("
    calculator.dataset.errorState = true;
  };
};

calcKeys.addEventListener('mousedown', e => e.preventDefault())

function operate(n1, n2, operator) {
  const operatorFunc = operatorFunctions[operator]
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  result = round(operatorFunc(firstNum, secondNum));
  return result.toString().length > 9 ? result.toExponential(5) : result;
}

window.addEventListener('keypress', (e) => {
  let targetButton = document.querySelector(`[data-key=${e.code}`)
  if (targetButton) targetButton.click()
})