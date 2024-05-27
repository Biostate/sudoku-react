import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {useEffect, useState} from 'react'
import SudokuBoard from "@/Components/SudokuBoard.jsx";
import { router } from '@inertiajs/react';

export default function Play({ auth, game, solution }) {

    const [currentGame, setCurrentGame] = useState(game)
    const [board, setBoard] = useState(currentGame.data)
    const [opponent, setOpponent] = useState(null)
    const environment = import.meta.env.VITE_APP_ENV;
    console.log("SOLUTION", solution, board)

    useEffect(() => {
        const boardInLocalStorage = localStorage.getItem('game');

        if (boardInLocalStorage) {
            setBoard(JSON.parse(boardInLocalStorage));
        }
        const leaveGame = () => {
            console.log('leaving game', game.id)
            window.Echo.leave(`games.${game.id}`)
        }

        window.Echo.join(`games.${game.id}`)
            .here((users) => {
                console.log('here', users);
                setOpponent(users.find(user => user.id !== auth.user.id))
            })
            .joining((user) => {
                console.log('joined', user);
                setOpponent(user.id !== auth.user.id ? user : opponent);
                // TODO: start game with ajax request
            })
            .leaving((user) => {
                console.log('leaved', user);
                setOpponent(null);
                // TODO: stop timer
                // TODO: stop game with ajax request
            })
            .error((error) => {
                console.error(error);
            })
            .listenForWhisper('message', (e) => {
                console.log(e);
            })
            .listen('.game_started', (e) => {
                console.log('game_started', e);
                setCurrentGame(e.game);
                setBoard(e.board);
                // TODO: start timer
            })
            .listen('.game_stopped', (e) => {
                console.log('game_stopped', e);
                // TODO: stop timer
            })
            .listen('.game_finished', (e) => {
                console.log('game_finished', e);
                setCurrentGame(e.game);
                localStorage.removeItem('game');
                // TODO: start timer
            })
            .listen('.game_updated', (e) => {
                console.log('game_updated', e);
                setCurrentGame(e.game);
            });

        return leaveGame;
    }, [])

    useEffect(() => {
        checkIfGameIsFinished();
    }, [board])

    const startGame = () => {
        router.post(`/game/${game.code}/start`, {});
    }


    const canStartGame = () => {
        return auth.user.id === currentGame.player1.id && currentGame.status === 'created' && opponent;
    }

    const showWaitingForPlayerOneToStartGameMessage = () => {
        return auth.user.id === currentGame.player2?.id && currentGame.status === 'created' && opponent;
    }

    const showWaitingForPlayerTwoToStartGameMessage = () => {
        return auth.user.id !== currentGame.player2?.id && currentGame.status === 'created' && !opponent;
    }

    const showGameFinishedMessage = () => {
        if (currentGame.status === 'finished') {
            if (currentGame.winner?.id === auth.user.id) {
                return (
                    <div>
                        <p>You won!</p>
                        <a href="/">Go to Home</a>
                    </div>
                )
            } else {
                return (
                    <div>
                        <p>You lost!</p>
                        <a href="/">Go to Home</a>
                    </div>
                )
            }
        }

        return '';
    }

    const handleCellChange = (x, y, value) => {
        const newBoard = board.map((r, i) => r.map((cell, j) => (i === x && j === y ? value : cell)));
        setBoard(newBoard);
        localStorage.setItem('game', JSON.stringify(newBoard));
    }

    const setSolution = () => {
        setBoard(solution);
        localStorage.setItem('game', JSON.stringify(solution));
    }

    const checkIfGameIsFinished = () => {
        const isFilled = board.every(row => row.every(cell => cell !== 0))
        if (isFilled) {
            console.log('Game finished')
            router.post(`/game/${game.code}/finish`, {board});
        }
    }

    const resetBoard = () => {
        setBoard(currentGame.data);
        localStorage.setItem('game', JSON.stringify(currentGame.data));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Play</h2>}
        >
            <Head title="Play" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div>
                            <p>Opponent: {opponent ? opponent.name : 'Waiting for opponent'}</p>
                            <p>Status: {currentGame.status}</p>
                        </div>

                        { environment === 'local' && (
                            <div>
                                <p><button onClick={() => setSolution()}>Set Solution</button></p>
                                <p><button onClick={() => resetBoard()}>Reset Board</button></p>
                            </div>
                        )}
                        <hr/>
                        {currentGame.status === 'playing' && (
                            <SudokuBoard board={board} onCellChange={handleCellChange}/>
                        )}
                        {canStartGame() && (
                            <div>
                                <button
                                    onClick={startGame}
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    Start Game
                                </button>
                            </div>
                        )}
                        {showWaitingForPlayerOneToStartGameMessage() && (
                            <div>
                                Waiting Player 1 to start the game
                            </div>
                        )}
                        {showWaitingForPlayerTwoToStartGameMessage() && (
                            <div>
                                Waiting Player 2 to start the game
                            </div>
                        )}

                        {showGameFinishedMessage()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
