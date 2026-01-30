class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
        
        this.initializeElements();
        this.updateDisplay();
        this.loadHistory();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Get display elements
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.historyList = document.getElementById('history-list');
        
        // Get all buttons
        this.numberButtons = document.querySelectorAll('[data-number]');
        this.operatorButtons = document.querySelectorAll('[data-action]');
        this.equalsButton = document.querySelector('[data-action="equals"]');
        this.clearButton = document.querySelector('[data-action="clear"]');
        this.backspaceButton = document.querySelector('[data-action="backspace"]');
        this.clearHistoryButton = document.getElementById('clear-history');
    }
    
    setupEventListeners() {
        // Number buttons
        this.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
            });
        });
        
        // Operator buttons
        this.operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                
                switch(action) {
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                    case 'percentage':
                        this.chooseOperation(action);
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'backspace':
                        this.delete();
                        break;
                    case 'equals':
                        this.calculate();
                        break;
                }
                this.updateDisplay();
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', event => {
            this.handleKeyboardInput(event);
        });
        
        // Clear history button
        this.clearHistoryButton.addEventListener('click', () => {
            this.clearHistory();
        });
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = (prev * current) / 100;
                break;
            default:
                return;
        }
        
        // Format the calculation for history
        const operationSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷',
            'percentage': '% of'
        };
        
        const calculationString = `${prev} ${operationSymbols[this.operation] || this.operation} ${current} = ${computation}`;
        
        // Add to history
        this.addToHistory(calculationString);
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }
    
    addToHistory(calculation) {
        this.history.unshift(calculation);
        if (this.history.length > 10) {
            this.history.pop();
        }
        this.saveHistory();
        this.loadHistory();
    }
    
    loadHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            this.historyList.appendChild(li);
        });
    }
    
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.loadHistory();
    }
    
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }
    
    delete() {
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        } else {
            this.currentOperand = '0';
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            const operationSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷',
                'percentage': '% of'
            };
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${operationSymbols[this.operation] || this.operation}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }
    
    handleKeyboardInput(event) {
        if ((event.key >= '0' && event.key <= '9') || event.key === '.') {
            this.appendNumber(event.key);
            this.updateDisplay();
        }
        
        if (event.key === '+') {
            this.chooseOperation('add');
            this.updateDisplay();
        }
        
        if (event.key === '-') {
            this.chooseOperation('subtract');
            this.updateDisplay();
        }
        
        if (event.key === '*') {
            this.chooseOperation('multiply');
            this.updateDisplay();
        }
        
        if (event.key === '/') {
            event.preventDefault();
            this.chooseOperation('divide');
            this.updateDisplay();
        }
        
        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            this.calculate();
            this.updateDisplay();
        }
        
        if (event.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        }
        
        if (event.key === 'Backspace') {
            this.delete();
            this.updateDisplay();
        }
        
        if (event.key === '%') {
            this.chooseOperation('percentage');
            this.updateDisplay();
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    
    // Add click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});