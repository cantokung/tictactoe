const gameBoard = (function(){
    let boardState = ['','','','','','','','','']
    let steps = 0
    let winner = ''
    const displayBoard = () => console.log(boardState)
    const click = (number) => {
        mark = checkXO()
        if (boardState[number] == ''){
            boardState[number] = mark
            steps++
            return true
        }else{
            return false
        }
    }
    const checkXO = () =>{
        if (steps %2 ==0){
            return 'O'
        }else{
            return 'X'
        }
        
    }
    const checkWinner = () =>{
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a]; // 'X' or 'O'
            }
        }
        // Optional: Add a tie check here if desired
        
        return 'No winner yet'; // No winner yet
    };
    const resetBoard = () =>{
        boardState = ['','','','','','','','','']
    }
    return {click, checkXO, checkWinner,displayBoard, resetBoard}
})();

function createPlayer (name,mark){
    return {name,mark}
}

const GameConTroller = (function(gameBoard){
    let player1 = null;
    let player2 = null;
    let turn = 0;

    const createOrUpdatePlayers = (name1, name2) => {
        player1 = createPlayer(name1, 'X');
        player2 = createPlayer(name2, 'O');
    };
    //check if 2 players are registered
    const checkPlayers = () => {
        return player1 !== null && player2 !== null && player1.name !== '' && player2.name !== '';
    };
    const getPlayerName = (playerNumber) => {
        if (playerNumber === 1 && player1 !== null) {
            return player1.name;
        } else if (playerNumber === 2 && player2 !== null) {
            return player2.name;
        }
        return 'Player does not exist.';
    };

    const initGame = () => {
        if (!checkPlayers()) {
            // Show alert or form for players to enter their names
            return false;
        }
        gameBoard.resetBoard();
        // Proceed with game start logic
        return true;
    }
    // // Handle the 'Game Start' action
    // const startGame = (name1,name2) =>{
    //     player1 = document.querySelector(".player1")
    //     player1.textContent = name1
    //     player2 = document.querySelector(".player2")
    //     player2.textContent = name2
    //     createOrUpdatePlayers(name1, name2);
    //     if (initGame()) {
    //         // Game starts successfully, show the game board and ready for interaction
    //     } else {
    //         // Handle the case where player names are not set properly
    //     }
    // };

    const startGame = (name1, name2) => {
        const player1Name = document.getElementById('player1Name');
        const player2Name = document.getElementById('player2Name');
        player1Name.textContent = name1;
        player2Name.textContent = name2;
        createOrUpdatePlayers(name1, name2);
        if (initGame()) {
            // Highlight the first player's name initially
            player1Name.classList.add('player1-turn');
            player2Name.classList.remove('player2-turn');
            turn = 0; // Reset the turn to zero
        } else {
            // Handle the case where player names are not set properly
        }
    };
    const resetGame = () => {
        turn = 0
        gameBoard.resetBoard();
        // Optionally reset player names or ask for new ones
    };

    // Handle the 'Cancel' action
    const cancelGame = () => {
        // Clear player names, hide game board, show 'Start Game' button
    };
    const playerMoves = (number) =>{
        if (gameBoard.click(number) == true){
            turn++
        }
        return checkWinStatus()
    }
    const checkWinStatus = () => {
        const winner = gameBoard.checkWinner();
        if (winner === 'X' || winner === 'O') {
            return winner;
        } else if (isTie()) {
            return 'tie';
        } else {
            return 'continue';
        }
    };
    const isTie = () => {
        return turn === 9 && gameBoard.checkWinner() === 'No winner yet';
    };
    const getCurrentPlayerMark = () => {
        return turn % 2 === 0 ? 'X' : 'O';
    };
    return { startGame, resetGame, cancelGame, playerMoves, initGame, getPlayerName, getCurrentPlayerMark, checkWinStatus };
})(gameBoard);


// GameConTroller.startGame('Pun','Pam')
// gameBoard.displayBoard()
// console.log(GameConTroller.getPlayerName(1))
// console.log(GameConTroller.playerMoves(5))
// gameBoard.displayBoard()
// console.log(GameConTroller.playerMoves(1))
// gameBoard.displayBoard()
// console.log(GameConTroller.playerMoves(2))
// gameBoard.displayBoard()
// console.log(GameConTroller.playerMoves(3))
// gameBoard.displayBoard()
// console.log(GameConTroller.playerMoves(8))
// gameBoard.displayBoard()


document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for the grid cells
    console.log('start yo')
    const startbtn = document.querySelector(".start");;
    startbtn.textContent = 'Start'
    
    const cells = document.querySelectorAll('.grid');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Event listener for the restart button
    document.querySelector('.start').addEventListener('click', gameSetting);
});


function handleCellClick(event) {
    // Make sure the cell is empty before proceeding
    if (event.target.textContent === '') {
        // Get cell index
        const cellIndex = event.target.id.replace('cell', '');
        console.log('click works');
        
        // Call the game's click function, if it returns true, update the UI
        if (GameConTroller.playerMoves(parseInt(cellIndex))) {
            // Update the cell's text with the current player's mark
            event.target.textContent = GameConTroller.getCurrentPlayerMark();
            // Additional code to handle turn change, check for winner, etc.
        }
        gameBoard.displayBoard();

        const gameStatus = GameConTroller.checkWinStatus();
        if (gameStatus === "X" || gameStatus === "O") {
            console.log('done with winner');
            showResultDialog(gameStatus + ' wins!');
        } else if (gameStatus === "tie") {
            console.log('done with tie');
            showResultDialog('The game ended in a draw.');
        } else {
            // Switch the highlight to the other player's name
            const player1Name = document.getElementById('player1Name');
            const player2Name = document.getElementById('player2Name');
            player1Name.classList.remove('player1-turn');
            player2Name.classList.remove('player2-turn');
            if (GameConTroller.getCurrentPlayerMark() === 'X') {
                player1Name.classList.add('player1-turn');
            } else {
                player2Name.classList.add('player2-turn');
            }
        }
    }
}

function restartGame() {
    // Call the game controller's reset method
    GameConTroller.resetGame();
    // Clear all grid cells
    const cells = document.querySelectorAll('.grid');
    cells.forEach(cell => {
        cell.textContent = '';
    });
    // Enable clicks again if disabled
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    // Remove the highlight from both player names
    const player1Name = document.getElementById('player1Name');
    const player2Name = document.getElementById('player2Name');
    player1Name.classList.remove('player1-turn');
    player2Name.classList.remove('player2-turn');

    // Highlight the first player's name initially
    player1Name.classList.add('player1-turn');
    GameConTroller.turn = 0; // Reset the turn to zero
}


function showResultDialog(message) {
    const resultDialog = document.getElementById('resultDialog');
    const resultMessage = document.getElementById('resultMessage');
    const continueBtn = document.getElementById('continueBtn');
    const quitBtn = document.getElementById('quitBtn');

    resultMessage.textContent = message;
    console.log('yo');
    resultDialog.showModal();
    console.log('Result dialog displayed');

    continueBtn.onclick = function() {
        resultDialog.close();
        restartGame();
    };

    quitBtn.onclick = function() {
        resultDialog.close();
        closeModal();
        // Remove the highlight from both player names
        const player1Name = document.getElementById('player1Name');
        const player2Name = document.getElementById('player2Name');
        player1Name.classList.remove('current-turn');
        player2Name.classList.remove('current-turn');
    };
}

// Function to open the modal
//const startBtn = document.querySelector("dialog + button");
//startBtn.addEventListener('click', gameSetting);

function openModal() {
    const modal = document.getElementById("myModal");
    modal.showModal();
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.close();
    modal.style.display = "none";
}

function gameSetting() {
    // Open the modal dialog to get player names
    openModal();

    // Submit button event listener
    document.getElementById('submitNames').onclick = function() {
        const player1name = document.getElementById('player1name').value.trim();
        const player2name = document.getElementById('player2name').value.trim();

        if (player1name && player2name) {
            // Update the player names, reset the board and start the game
            restartGame()
            GameConTroller.startGame(player1name, player2name);
            closeModal(); // Close the modal dialog
        } else {
            alert('Please enter names for both players.');
        }
    };

    // Cancel button event listener
    document.getElementById('cancel').onclick = function() {
        closeModal(); // Close the modal dialog
        // Here you can navigate to the loading page or simply do nothing
        // If you want to ensure no action on grid, you can disable the grid or hide it
        const cells = document.querySelectorAll('.grid');
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    };
}

// Attaching event listener to the start/reset button
document.querySelector('.start').addEventListener('click', gameSetting);  
  // Start/reset button event listener
document.querySelector('.start').addEventListener('click', function() {
    // Change button text based on whether the game is starting or resetting
    if(this.textContent.toLowerCase() === 'start') {
      this.textContent = 'Reset';
    } 
    gameSetting();
});
  
  // Initially call gameSetting to ensure players cannot click on grid

  


