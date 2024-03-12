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
            return 'X'
        }else{
            return 'O'
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
    // Handle the 'Game Start' action
    const startGame = (name1,name2) =>{
        createOrUpdatePlayers(name1, name2);
        if (initGame()) {
            // Game starts successfully, show the game board and ready for interaction
        } else {
            // Handle the case where player names are not set properly
        }
    };
    const resetGame = () => {
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
            return winner + ' wins!';
        } else if (isTie()) {
            return 'tie';
        } else {
            return 'continue';
        }
    };
    const isTie = () => {
        return steps === 9 && gameBoard.checkWinner() === 'No winner yet';
    };
    
    return { startGame, resetGame, cancelGame, playerMoves,initGame,getPlayerName };
})(gameBoard);


GameConTroller.startGame('Pun','Pam')
gameBoard.displayBoard()
console.log(GameConTroller.getPlayerName(1))
console.log(GameConTroller.playerMoves(5))
gameBoard.displayBoard()
console.log(GameConTroller.playerMoves(1))
gameBoard.displayBoard()
console.log(GameConTroller.playerMoves(2))
gameBoard.displayBoard()
console.log(GameConTroller.playerMoves(3))
gameBoard.displayBoard()
console.log(GameConTroller.playerMoves(8))
gameBoard.displayBoard()




