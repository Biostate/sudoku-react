import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SudokuBoard from "@/Components/SudokuBoard.jsx";

export default function Play({ auth, game, solution }) {
    const [currentGame, setCurrentGame] = useState(game);
    const [board, setBoard] = useState(currentGame.data ?? []);
    const [opponent, setOpponent] = useState(null);
    const environment = import.meta.env.VITE_APP_ENV;

    useEffect(() => {
        const boardInLocalStorage = localStorage.getItem('game');
        if (boardInLocalStorage) {
            setBoard(JSON.parse(boardInLocalStorage));
        }

        const leaveGame = () => {
            window.Echo.leave(`games.${game.id}`);
        };

        window.Echo.join(`games.${game.id}`)
            .here((users) => {
                setOpponent(users.find(user => user.id !== auth.user.id));
            })
            .joining((user) => {
                setOpponent(user.id !== auth.user.id ? user : opponent);
            })
            .leaving(() => {
                setOpponent(null);
            })
            .listen('.game_started', (e) => {
                setCurrentGame(e.game);
                setBoard(e.board);
            })
            .listen('.game_finished', (e) => {
                setCurrentGame(e.game);
                localStorage.removeItem('game');
            })
            .listen('.game_updated', (e) => {
                setCurrentGame(e.game);
            })
            .listenForWhisper('cellChanged', (e) => {
                console.log(e.x, e.y, e.value);
                handleCellChange(e.x, e.y, e.value, true);
            });

        return leaveGame;
    }, []);

    useEffect(() => {
        checkIfGameIsFinished();
    }, [board]);

    const startGame = () => {
        router.post(`/game/${game.code}/start`, {});
    };

    const canStartGame = () => {
        return auth.user.id === currentGame.player1.id && currentGame.status === 'created' && opponent;
    };

    const showWaitingForPlayerOneToStartGameMessage = () => {
        return auth.user.id === currentGame.player2?.id && currentGame.status === 'created' && opponent;
    };

    const showWaitingForPlayerTwoToStartGameMessage = () => {
        return auth.user.id !== currentGame.player2?.id && currentGame.status === 'created' && !opponent;
    };

    const showGameFinishedMessage = () => {
        if (currentGame.status === 'finished') {
            if (currentGame.winner?.id === auth.user.id) {
                return (
                    <div className="text-center mt-4">
                        <p className="text-green-600 font-semibold">You won!</p>
                        <a href="/" className="text-blue-500 underline">Go to Home</a>
                    </div>
                );
            } else {
                return (
                    <div className="text-center mt-4">
                        <p className="text-red-600 font-semibold">You lost!</p>
                        <a href="/" className="text-blue-500 underline">Go to Home</a>
                    </div>
                );
            }
        }
        return '';
    };

    const handleCellChange = (x, y, value, isOutSource = false) => {
        const newBoard = board.map((r, i) => r.map((cell, j) => (i === x && j === y ? value : cell)));
        setBoard(board => {
            return board.map((r, i) => r.map((cell, j) => (i === x && j === y ? value : cell)));
        });
        localStorage.setItem('game', JSON.stringify(newBoard));
        console.log(game.mode)
        if (!isOutSource && game.mode === 'coop') {
            window.Echo.join(`games.${game.id}`)
                .whisper('cellChanged', {
                    x,
                    y,
                    value
                });
        }
    };

    const setSolution = () => {
        setBoard(solution);
        localStorage.setItem('game', JSON.stringify(solution));
    };

    const checkIfGameIsFinished = () => {
        if (board.length === 0) return;

        const isFilled = board.every(row => row.every(cell => cell !== 0));
        if (isFilled) {
            router.post(`/game/${game.code}/finish`, { board }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const resetBoard = () => {
        setBoard(currentGame.data);
        localStorage.setItem('game', JSON.stringify(currentGame.data));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Play</h2>}
        >
            <Head title="Play" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Room: {currentGame.code}</p>
                            <p className="text-lg font-semibold">Mode: {currentGame.mode}</p>
                            <p className="text-lg font-semibold">{currentGame.mode === "versus" ? 'Opponent' : 'Teammate'}: {opponent ? opponent.name : 'Waiting'}</p>
                        </div>

                        {environment === 'local' && (
                            <div className="mb-4 bg-slate-300 border-slate-400 border-2 rounded-md p-2">
                                <p className="text-lg font-semibold">Status: {currentGame.status}</p>
                                <button
                                    onClick={setSolution}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                                >
                                    Set Solution
                                </button>
                                <button
                                    onClick={resetBoard}
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                >
                                    Reset Board
                                </button>
                                <p className="text-sm text-gray-500">
                                    This area will not be visible in production. This section is development only.
                                </p>
                            </div>
                        )}

                        <hr className="mb-4"/>

                        {currentGame.status === 'playing' && (
                            <SudokuBoard board={board} onCellChange={handleCellChange} />
                        )}

                        {canStartGame() && (
                            <div className="mt-4">
                                <button
                                    onClick={startGame}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Start Game
                                </button>
                            </div>
                        )}

                        {showWaitingForPlayerOneToStartGameMessage() && (
                            <div className="mt-4 text-center text-yellow-600">
                                Waiting Player 1 to start the game
                            </div>
                        )}

                        {showWaitingForPlayerTwoToStartGameMessage() && (
                            <div className="mt-4 text-center text-yellow-600">
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
