class SudokuGame {
    constructor() {
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.difficulty = 'medium';
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
        this.generateSudoku();
        this.renderBoard();
        this.showMessage('', '');
    }

    generateSudoku() {
        // Create a solved sudoku
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillBoard(0, 0);
        
        // Store the solution
        this.solution = this.board.map(row => [...row]);
        
        // Remove numbers based on difficulty
        const cellsToRemove = {
            'easy': 35,
            'medium': 45,
            'hard': 55
        }[this.difficulty];
        
        this.removeNumbers(cellsToRemove);
    }

    fillBoard(row, col) {
        if (row === 9) return true;
        if (col === 9) return this.fillBoard(row + 1, 0);
        
        const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
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
        for (let x = 0; x < 9; x++) {
            if (this.board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (this.board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    removeNumbers(count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
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
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
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
        if (value && !/^[1-9]$/.test(value)) {
            e.target.value = '';
        }
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
                newRow = Math.min(8, row + 1);
                e.preventDefault();
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                newCol = Math.min(8, col + 1);
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
