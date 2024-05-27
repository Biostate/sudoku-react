export function isValidSudoku(board) {
    const size = 9;
    const boxSize = 3;

    const isValidGroup = (group) => {
        const seen = new Set();
        for (let num of group) {
            if (num < 1 || num > 9 || seen.has(num)) {
                return false;
            }
            seen.add(num);
        }
        return true;
    };

    for (let i = 0; i < size; i++) {
        const row = board[i];
        const column = board.map(row => row[i]);
        if (!isValidGroup(row) || !isValidGroup(column)) {
            return false;
        }
    }

    for (let row = 0; row < size; row += boxSize) {
        for (let col = 0; col < size; col += boxSize) {
            const box = [];
            for (let r = 0; r < boxSize; r++) {
                for (let c = 0; c < boxSize; c++) {
                    box.push(board[row + r][col + c]);
                }
            }
            if (!isValidGroup(box)) {
                return false;
            }
        }
    }

    return true;
}
