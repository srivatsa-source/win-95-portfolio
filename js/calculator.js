(function() {
    'use strict';

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetScreen = false;

    const display = document.getElementById('calc-display-text');

    window.initCalculator = function() {
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => handleButtonClick(btn.dataset.value, btn.dataset.type));
        });
        updateDisplay();
    };

    function handleButtonClick(value, type) {
        if (type === 'number') {
            appendNumber(value);
        } else if (type === 'operator') {
            chooseOperation(value);
        } else if (type === 'action') {
            if (value === 'clear') clear();
            if (value === 'equals') compute();
            if (value === 'sqrt') sqrt();
            if (value === 'percent') percent();
            if (value === 'reciprocal') reciprocal();
        }
        updateDisplay();
    }

    function appendNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            resetScreen();
        }
        currentInput += number;
    }

    function resetScreen() {
        currentInput = '';
        shouldResetScreen = false;
    }

    function clear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
    }

    function chooseOperation(op) {
        if (operation !== null) compute();
        previousInput = currentInput;
        operation = op;
        shouldResetScreen = true;
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        currentInput = computation.toString();
        operation = null;
    }

    function sqrt() {
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
    }

    function percent() {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }

    function reciprocal() {
        currentInput = (1 / parseFloat(currentInput)).toString();
    }

    function updateDisplay() {
        const displayElement = document.getElementById('calc-display-text');
        if (displayElement) {
            displayElement.textContent = currentInput.substring(0, 12);
        }
    }

    // Initialize if window is already present
    if (document.getElementById('calculator')) {
        window.initCalculator();
    }
})();
