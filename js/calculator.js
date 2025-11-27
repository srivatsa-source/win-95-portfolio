(function() {
    'use strict';

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetScreen = false;
    let memory = 0;

    const display = document.getElementById('calc-display-text');
    const memBox = document.querySelector('.calc-mem-box');

    window.initCalculator = function() {
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(btn => {
            // Use onclick to avoid duplicate listeners if init is called multiple times
            btn.onclick = () => handleButtonClick(btn.dataset.value, btn.dataset.type);
        });
        updateDisplay();
    };

    function handleButtonClick(value, type) {
        if (type === 'number') {
            appendNumber(value);
        } else if (type === 'operator') {
            chooseOperation(value);
        } else if (type === 'action') {
            handleAction(value);
        } else if (type === 'memory') {
            handleMemory(value);
        }
        updateDisplay();
    }

    function appendNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            if (number === '.') {
                currentInput = '0.';
            } else {
                currentInput = number;
            }
            shouldResetScreen = false;
        } else {
            if (number === '.' && currentInput.includes('.')) return;
            currentInput += number;
        }
    }

    function handleAction(action) {
        switch (action) {
            case 'clear': // C
                currentInput = '0';
                previousInput = '';
                operation = null;
                break;
            case 'ce': // CE
                currentInput = '0';
                break;
            case 'back': // Backspace
                if (shouldResetScreen) return;
                currentInput = currentInput.toString().slice(0, -1);
                if (currentInput === '' || currentInput === '-') currentInput = '0';
                break;
            case 'equals':
                compute();
                break;
            case 'sqrt':
                if (parseFloat(currentInput) < 0) {
                    alert("Invalid input for function");
                    currentInput = '0';
                } else {
                    currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                    shouldResetScreen = true;
                }
                break;
            case 'percent':
                if (operation && previousInput) {
                    const prev = parseFloat(previousInput);
                    const curr = parseFloat(currentInput);
                    const val = prev * (curr / 100);
                    currentInput = val.toString();
                } else {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                    shouldResetScreen = true;
                }
                break;
            case 'reciprocal': // 1/x
                if (parseFloat(currentInput) === 0) {
                    alert("Cannot divide by zero");
                    currentInput = '0';
                } else {
                    currentInput = (1 / parseFloat(currentInput)).toString();
                    shouldResetScreen = true;
                }
                break;
            case 'sign': // +/-
                currentInput = (parseFloat(currentInput) * -1).toString();
                break;
        }
    }

    function handleMemory(action) {
        const current = parseFloat(currentInput);
        switch (action) {
            case 'MC':
                memory = 0;
                break;
            case 'MR':
                currentInput = memory.toString();
                shouldResetScreen = true;
                break;
            case 'MS':
                memory = current;
                shouldResetScreen = true;
                break;
            case 'M+':
                memory += current;
                shouldResetScreen = true;
                break;
        }
    }

    function chooseOperation(op) {
        if (operation !== null && !shouldResetScreen) {
            compute();
        }
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
                    currentInput = '0';
                    operation = null;
                    shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        currentInput = computation.toString();
        operation = null;
        shouldResetScreen = true;
    }

    function updateDisplay() {
        let displayValue = currentInput;
        if (displayValue.length > 20) {
            displayValue = displayValue.substring(0, 20);
        }
        
        const displayElement = document.getElementById('calc-display-text');
        if (displayElement) {
             if (displayValue.indexOf('.') === -1) {
                 displayElement.innerText = displayValue + '.';
             } else {
                 displayElement.innerText = displayValue;
             }
        }

        const memBoxElement = document.querySelector('.calc-mem-box');
        if (memBoxElement) {
            memBoxElement.innerText = memory !== 0 ? 'M' : '';
        }
    }

    // Expose global functions for Menu interactions
    window.copyCalc = function() {
        navigator.clipboard.writeText(currentInput).then(() => {
            // Optional: visual feedback
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
    };

    window.pasteCalc = function() {
        navigator.clipboard.readText().then(text => {
            if (!isNaN(parseFloat(text))) {
                currentInput = parseFloat(text).toString();
                updateDisplay();
            } else {
                alert('Clipboard does not contain a valid number');
            }
        }).catch(err => {
            console.error('Failed to read clipboard: ', err);
        });
    };

    // Initialize if window is already present
    if (document.getElementById('calculator')) {
        window.initCalculator();
    }
})();
