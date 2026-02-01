class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.difficulty = 'medium';
        this.size = 9;
        this.boxSize = 3;
        this.init();
    }

    init() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('checkSolution').addEventListener('click', () => this.checkSolution());
        document.getElementById('solve').addEventListener('click', () => this.showSolution());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.newGame();
        });
        this.newGame();
    }

    newGame() {
        // Set grid size based on difficulty
        if (this.difficulty === 'supereasy') {
            this.size = 4;
            this.boxSize = 2;
        } else {
            this.size = 9;
            this.boxSize = 3;
        }
        
        this.generateSudoku();
        this.renderBoard();
        this.showMessage('', '');
    }

    generateSudoku() {
        // Create a solved sudoku
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.fillBoard(0, 0);
        
        // Store the solution
        this.solution = this.board.map(row => [...row]);
        
        // Remove numbers based on difficulty
        const cellsToRemove = {
            'supereasy': 8,
            'easy': 35,
            'medium': 45,
            'hard': 55
        }[this.difficulty];
        
        this.removeNumbers(cellsToRemove);
    }

    fillBoard(row, col) {
        if (row === this.size) return true;
        if (col === this.size) return this.fillBoard(row + 1, 0);
        
        const numbers = this.shuffle(Array.from({length: this.size}, (_, i) => i + 1));
        
        for (let num of numbers) {
            if (this.isValid(row, col, num)) {
                this.board[row][col] = num;
                if (this.fillBoard(row, col + 1)) return true;
                this.board[row][col] = 0;
            }
        }
        
        return false;
    }

    isValid(row, col, num) {
        // Check row
        for (let x = 0; x < this.size; x++) {
            if (this.board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < this.size; x++) {
            if (this.board[x][col] === num) return false;
        }
        
        // Check box
        const startRow = row - row % this.boxSize;
        const startCol = col - col % this.boxSize;
        for (let i = 0; i < this.boxSize; i++) {
            for (let j = 0; j < this.boxSize; j++) {
                if (this.board[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    removeNumbers(count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                removed++;
            }
        }
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    renderBoard() {
        const boardElement = document.getElementById('sudoku-board');
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                // Add box border classes
                if ((col + 1) % this.boxSize === 0 && col !== this.size - 1) {
                    cell.classList.add('box-right');
                }
                if ((row + 1) % this.boxSize === 0 && row !== this.size - 1) {
                    cell.classList.add('box-bottom');
                }
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.inputMode = 'numeric';
                input.pattern = `[1-${this.size}]`;
                input.dataset.row = row;
                input.dataset.col = col;
                
                if (this.board[row][col] !== 0) {
                    input.value = this.board[row][col];
                    input.disabled = true;
                    cell.classList.add('fixed');
                }
                
                input.addEventListener('input', (e) => this.handleInput(e));
                input.addEventListener('keydown', (e) => this.handleKeydown(e));
                
                cell.appendChild(input);
                boardElement.appendChild(cell);
            }
        }
    }

    handleInput(e) {
        const value = e.target.value;
        // Only allow valid digits for current grid size
        const validPattern = new RegExp(`^[1-${this.size}]$`);
        if (value && !validPattern.test(value)) {
            e.target.value = '';
            return;
        }
        e.target.value = value.replace(new RegExp(`[^1-${this.size}]`, 'g'), '');
    }

    handleKeydown(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        let newRow = row;
        let newCol = col;
        
        switch(e.key) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                newRow = Math.min(this.size - 1, row + 1);
                e.preventDefault();
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                newCol = Math.min(this.size - 1, col + 1);
                e.preventDefault();
                break;
            default:
                return;
        }
        
        const inputs = document.querySelectorAll('.cell input');
        const targetInput = Array.from(inputs).find(input => 
            input.dataset.row == newRow && input.dataset.col == newCol
        );
        
        if (targetInput) {
            targetInput.focus();
        }
    }

    checkSolution() {
        const inputs = document.querySelectorAll('.cell input:not([disabled])');
        let isComplete = true;
        let hasErrors = false;
        
        // Clear previous error states
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));
        
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            const value = parseInt(input.value);
            
            if (!value) {
                isComplete = false;
                return;
            }
            
            if (value !== this.solution[row][col]) {
                input.parentElement.classList.add('error');
                hasErrors = true;
            }
        });
        
        if (!isComplete) {
            this.showMessage('Puzzle is not complete yet!', 'error');
        } else if (hasErrors) {
            this.showMessage('Some cells are incorrect. Try again!', 'error');
        } else {
            this.showMessage('🎉 Congratulations! You solved it!', 'success');
        }
    }

    showSolution() {
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            input.value = this.solution[row][col];
        });
        this.showMessage('Solution revealed!', 'success');
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = 'message ' + type;
    }
}

// Initialize the game
new SudokuGame();

// Update info text based on difficulty
document.getElementById('difficulty').addEventListener('change', (e) => {
    const infoText = document.getElementById('info-text');
    const infoRules = document.getElementById('info-rules');
    if (e.target.value === 'supereasy') {
        infoText.textContent = 'Fill in the empty cells with numbers 1-4';
        infoRules.textContent = 'Each row, column, and 2x2 box must contain all digits 1-4';
    } else {
        infoText.textContent = 'Fill in the empty cells with numbers 1-9';
        infoRules.textContent = 'Each row, column, and 3x3 box must contain all digits 1-9';
    }
});
