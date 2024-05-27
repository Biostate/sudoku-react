import { isValidSudoku } from '@/utils.js';
import {useEffect, useRef, useState} from "react";

export default function SudokuBoard({ board, onCellChange = (x, y , value) => console.log(x, y, value)}) {
    const [selectedCell, setSelectedCell] = useState(null);
    const boardRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (selectedCell && event.key >= '1' && event.key <= '9') {
                const { row, col } = selectedCell;
                const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? parseInt(event.key) : cell)));
                onCellChange(row, col, parseInt(event.key));
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedCell, board, onCellChange]);

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
        if (boardRef.current) {
            boardRef.current.focus();
        }
    };

    const handleButtonClick = (num) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? num : cell)));
            onCellChange(row, col, num);
        }
    };

    return (
        <div className="p-4 flex flex-col items-center min-h-screen bg-gray-100">
            <div
                ref={boardRef}
                tabIndex={0}
                className="grid grid-cols-9 gap-0.5 bg-white p-4 shadow-lg rounded outline-none"
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <input
                            key={`${rowIndex}-${colIndex}`}
                            type="text"
                            value={cell === 0 ? '' : cell}
                            readOnly
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={`w-10 h-10 text-center border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                                (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2' : ''
                            } ${
                                (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2' : ''
                            } ${
                                selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'bg-blue-200' : ''
                            }`}
                        />
                    ))
                )}
            </div>
            <div className="flex mt-4 space-x-2">
                {[...Array(9)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handleButtonClick(i + 1)}
                        className="w-10 h-10 text-center bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700"
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
