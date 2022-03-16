//Player factory functgion
const createPlayer = (name, marker) => {
    return {name, marker};
}

//Game board module
const gameBoard = (function() {

    //Instantializes board
    let board = ['', '', '', 
                 '', '', '', 
                 '', '', '' ];

    const getBoard = () => {
        return board;
    }

    const resetBoard = () => {
        board = ['', '', '', 
                 '', '', '', 
                 '', '', '' ];
    }

    const setBoard = (index, marker) => {
        board[index] = marker;
    }

    return {
        getBoard,
        resetBoard,
        setBoard,

    };
})();

//Game system module
const gameSystem = (function() {
    const playerOne = createPlayer('Player X', 'X');
    const playerTwo = createPlayer('Player O', 'O');


    let tilesLeft = 9;
    let currentPlayer = playerOne;
    let gameOver = false;
    let gameWinner = '';

    //Possible win conditions
    const winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6],
    ]

    //Switches players 
    const nextPlayer = () => {
        if(currentPlayer == playerOne) currentPlayer = playerTwo;
        else currentPlayer = playerOne;
    }

    //Checks if player markers match any of the win conditions
    const checkWinner = () => {
        winCombos.forEach((value, index) => {
            if(gameBoard.getBoard()[value[0]] == currentPlayer.marker && gameBoard.getBoard()[value[1]] == currentPlayer.marker && gameBoard.getBoard()[value[2]] == currentPlayer.marker) {
                gameOver = true;
                gameWinner = currentPlayer;
            }

        })
        if(tilesLeft == 0) {
            gameOver = true;
            gameWinner = 'tie';
        }
    }

    //Checks if anyone has won
    const isGameOver = () => {
        return gameOver;
    }

    const getWinner = () => {
        return gameWinner;
    }

    //Reduce remaining squares by 1
    const reduceTiles = () => {
        tilesLeft--;
    }

    const getTilesLeft = () => {
        return tilesLeft;
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const getPlayer = (player) => {
        if(player === 'one') {
            return playerOne;
        }
        else if (player === 'two') {
            return playerTwo;
        }
    }

    const resetGame = () => {
        tilesLeft = 9;
        currentPlayer = playerOne;
        gameOver = false;
        gameWinner = '';
        gameBoard.resetBoard();
        displayController.resetDisplay();
    }

    return {
        getPlayer,
        nextPlayer,
        getCurrentPlayer,
        checkWinner,
        isGameOver,
        reduceTiles,
        getWinner,
        getTilesLeft,
        resetGame
    }
})();

//Display module
const displayController = (function() {
    const announceText = document.querySelector('.announce');
    const tiles = document.querySelectorAll('.tile');
    const resetButton = document.getElementById('reset');
    
    //Tile event listeners
    tiles.forEach((value, index) => {
        value.addEventListener('click', () => {
            if(gameBoard.getBoard()[index] !== '' || gameSystem.isGameOver()) return;
            gameBoard.setBoard(index, gameSystem.getCurrentPlayer().marker);
            setTile(value);
            gameSystem.reduceTiles();
            gameSystem.checkWinner();
            gameSystem.nextPlayer();
            announceCurrentPlayer();
            announceWinner();
        });
    });

    //Change tile to player marker
    const setTile = (element) => {
        element.innerHTML = gameSystem.getCurrentPlayer().marker;
    }

    function announceCurrentPlayer() {
        announceText.innerHTML = `${gameSystem.getCurrentPlayer().name}'s turn`;
    }

    //Changes announce text to display winner
    function announceWinner() {
        if(gameSystem.isGameOver() && gameSystem.getWinner() != 'tie') {
            announceText.innerHTML =  `Congratulations ${gameSystem.getWinner().name}, you won!`
        }
        else if(gameSystem.isGameOver() && gameSystem.getWinner() == 'tie') {
            announceText.innerHTML = 'Tie game!';
        }
    }

    //Reset Game Board display
    const resetDisplay = () => {
        tiles.forEach((value, index) => {
            value.innerHTML = '';
        })
        announceText.innerHTML = 'Player X\'s Turn';
    }

    //Reset Button event listener
    resetButton.addEventListener('click', () => {
        gameSystem.resetGame();
    })

    return {
        resetDisplay
    }
})();