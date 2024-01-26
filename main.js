// Initialization
let currentPlayer = 'X', gameActive = false;
const gameState = Array(9).fill("");
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Selectors
const statusDisplay = document.querySelector('#statusArea');
const gameBoard = document.getElementById('gameBoard');
const pvpButton = document.getElementById('pvp');
const pveButton = document.getElementById('pve');

// Functions
const handleCellPlayed = (index, player) => {
    gameState[index] = player;
    gameBoard.children[index].innerHTML = player;
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
};

const handleResultValidation = () => {
    const roundWon = winningConditions.some(condition => 
        condition.every(index => gameState[index] === currentPlayer));

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerHTML = "Game ended in a draw!";
        gameActive = false;
    }
};

const handleCellClick = (event) => {
    const clickedCellIndex = event.target.dataset.cellIndex;
    if (gameActive && clickedCellIndex && gameState[clickedCellIndex] === "") {
        handleCellPlayed(clickedCellIndex, currentPlayer);
        handleResultValidation();
        if (gameActive) handlePlayerChange();
    }
};

const handleRestartGame = () => {
    location.reload();
};

const handleModeSelection = (mode) => {

    if (mode === 'pve') {
        gameActive = true;
        gameBoard.classList.remove('disabled');
        statusDisplay.innerHTML = `Player X's turn`;

        // Set up the board for player vs AI
        Array.from(gameBoard.children).forEach(cell => {
            cell.innerHTML = ""; // Clear the cell
            cell.removeEventListener('click', handleCellClick); // Remove previous listeners to avoid multiple triggers
            cell.addEventListener('click', (event) => {
                handleCellClick(event);
                if (gameActive && currentPlayer === 'O') {
                    setTimeout(handleAIMove, 500); // AI makes a move after a delay
                }
            });
        });
    } else if (mode === 'pvp') {
        // Set up the board for player vs player
        handlePvPMode();
    }
};

const handleAIMove = () => {
    const minimax = (newGameState, depth, isMaximizing) => {
        const winner = checkWinner(newGameState);
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (!newGameState.includes("")) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < newGameState.length; i++) {
                if (newGameState[i] === "") {
                    newGameState[i] = 'O';
                    let score = minimax(newGameState, depth + 1, false);
                    newGameState[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < newGameState.length; i++) {
                if (newGameState[i] === "") {
                    newGameState[i] = 'X';
                    let score = minimax(newGameState, depth + 1, true);
                    newGameState[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const checkWinner = (gs) => {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gs[a] && gs[a] === gs[b] && gs[a] === gs[c]) {
                return gs[a];
            }
        }
        return null;
    };

    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        gameState[move] = 'O';
        document.querySelector(`[data-cell-index="${move}"]`).innerHTML = 'O';
        handleResultValidation();
        if (gameActive) handlePlayerChange();
    }
};


const handlePvPMode = () => {
    gameActive = true;
    currentPlayer = 'X'; // Reset to player X
    gameState.fill(""); // Clear the game state
    gameBoard.classList.remove('disabled');
    statusDisplay.innerHTML = `Player X's turn`;

    // Add event listeners to each cell for PvP interactions
    Array.from(gameBoard.children).forEach(cell => {
        cell.innerHTML = ""; // Clear the cell
        cell.removeEventListener('click', handleCellClick); // Remove previous listeners to avoid multiple triggers
        cell.addEventListener('click', handleCellClick);
    });
};

// Event listeners
pvpButton.addEventListener('click', () => handleModeSelection('pvp'));
pveButton.addEventListener('click', () => handleModeSelection('pve'));
document.querySelector('#gameRestart').addEventListener('click', handleRestartGame);