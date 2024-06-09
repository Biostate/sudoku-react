import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function Dashboard({ auth }) {
    const [gameCode, setGameCode] = useState('')
    const [difficultyLevel, setDifficultyLevel] = useState(7)
    const [gameMode, setGameMode] = useState('versus')
    const [enableHighlighting, setEnableHighlighting] = useState('0')

    function joinGame(e) {
        e.preventDefault()
        router.get('/game/'+gameCode)
    }

    function createGame(e) {
        e.preventDefault()
        router.post('/game', {
            difficulty_level: difficultyLevel,
            game_mode: gameMode,
            enable_highlighting: enableHighlighting
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <form onSubmit={joinGame} className="space-y-4">
                            <div>
                                <label htmlFor="game_code" className="block text-sm font-medium text-gray-700">
                                    Game Code:
                                </label>
                                <input
                                    id="game_code"
                                    type="text"
                                    value={gameCode}
                                    onChange={(e) => setGameCode(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter game code"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Join Game
                                </button>
                            </div>
                        </form>
                        <div className="mt-6 text-center">
                            <hr className="mb-4" />
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                OR
                            </h2>
                            <hr className="mt-4" />
                        </div>
                        <div className="mt-6">
                            <form onSubmit={createGame} className="space-y-4">
                                <div>
                                    <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700">
                                        Difficulty Level:
                                    </label>
                                    <select
                                        id="difficulty_level"
                                        value={difficultyLevel}
                                        onChange={(e) => setDifficultyLevel(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="14">Easy</option>
                                        <option value="12">Medium</option>
                                        <option value="10">Hard</option>
                                        <option value="8">Very Hard</option>
                                        <option value="6">Insane</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700">
                                        Enable Highlighting:
                                    </label>
                                    <select
                                        id="difficulty_level"
                                        value={enableHighlighting}
                                        onChange={(e) => setEnableHighlighting(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="game_mode" className="block text-sm font-medium text-gray-700">
                                        Game Mode:
                                    </label>
                                    <select
                                        id="game_mode"
                                        value={gameMode}
                                        onChange={(e) => setGameMode(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="versus">Versus</option>
                                        <option value="coop">Coop</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Create Game
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
