import { useEffect, useRef, useState } from "react";

export default function SudokuBoard({ board, puzzle, onCellChange = (x, y, value) => console.log(x, y, value), enableHighlighting = false }) {
    const [selectedCell, setSelectedCell] = useState(null);
    const [primaryHighlightedCells, setPrimaryHighlightedCells] = useState([]);
    const [secondaryHighlightedCells, setSecondaryHighlightedCells] = useState([]);
    const boardRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (selectedCell && event.key >= '1' && event.key <= '9') {
                const { row, col } = selectedCell;
                if (puzzle[row][col] === 0) {
                    const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? parseInt(event.key) : cell)));
                    onCellChange(row, col, parseInt(event.key));
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedCell, board, puzzle, onCellChange]);

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });

        if (enableHighlighting && board[row][col] !== 0) {
            const num = board[row][col];
            const newPrimaryHighlightedCells = [];
            const newSecondaryHighlightedCells = [];

            // Highlight the row and column of the selected cell
            for (let i = 0; i < 9; i++) {
                newPrimaryHighlightedCells.push({ row: i, col });
                newPrimaryHighlightedCells.push({ row, col: i });
            }

            // Highlight the 3x3 subgrid of the selected cell
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    newPrimaryHighlightedCells.push({ row: startRow + i, col: startCol + j });
                }
            }

            // Highlight other cells with the same number and their rows and columns
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] === num) {
                        // Highlight the cell itself as secondary highlight
                        if (i !== row || j !== col) {
                            newSecondaryHighlightedCells.push({ row: i, col: j });
                        }

                        // Highlight the row and column of this cell as secondary highlight
                        for (let k = 0; k < 9; k++) {
                            if (i !== row) {
                                newSecondaryHighlightedCells.push({ row: i, col: k });
                            }
                            if (j !== col) {
                                newSecondaryHighlightedCells.push({ row: k, col: j });
                            }
                        }

                        // Highlight the 3x3 subgrid of this cell as secondary highlight
                        const cellStartRow = Math.floor(i / 3) * 3;
                        const cellStartCol = Math.floor(j / 3) * 3;
                        for (let m = 0; m < 3; m++) {
                            for (let n = 0; n < 3; n++) {
                                if (cellStartRow + m !== row || cellStartCol + n !== col) {
                                    newSecondaryHighlightedCells.push({ row: cellStartRow + m, col: cellStartCol + n });
                                }
                            }
                        }
                    }
                }
            }

            setPrimaryHighlightedCells(newPrimaryHighlightedCells);
            setSecondaryHighlightedCells(newSecondaryHighlightedCells);
        } else {
            setPrimaryHighlightedCells([]);
            setSecondaryHighlightedCells([]);
        }

        if (boardRef.current) {
            boardRef.current.focus();
        }
    };

    const handleButtonClick = (num) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            if (puzzle[row][col] === 0) {
                const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? num : cell)));
                onCellChange(row, col, num);
            }
        }
    };

    const isPrimaryHighlighted = (row, col) => {
        return primaryHighlightedCells.some(cell => cell.row === row && cell.col === col);
    };

    const isSecondaryHighlighted = (row, col) => {
        return secondaryHighlightedCells.some(cell => cell.row === row && cell.col === col);
    };

    return (
        <div className="p-4 flex flex-col items-center min-h-screen bg-gray-100">
            <div
                ref={boardRef}
                tabIndex={0}
                className="grid grid-cols-9 bg-white p-4 shadow-lg rounded outline-none"
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
                            } ${isPrimaryHighlighted(rowIndex, colIndex) ? 'bg-gray-400' : ''} ${isSecondaryHighlighted(rowIndex, colIndex) ? 'bg-gray-200' : ''} ${puzzle[rowIndex][colIndex] !== 0 ? 'font-bold' : ''}`}
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
