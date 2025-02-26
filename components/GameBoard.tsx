import React from 'react';
import { CellContent } from '../types';

type CellStatus = 'correct' | 'present' | 'absent' | 'empty';

interface GameBoardProps {
    cells: CellContent[][];
}

const Cell: React.FC<{ letter: string; status: CellStatus }> = ({ letter, status }) => {
    const getBackgroundColor = () => {
        switch (status) {
            case 'correct':
                return 'bg-green-500';
            case 'present':
                return 'bg-yellow-500';
            case 'absent':
                return 'bg-gray-500';
            default:
                return 'bg-gray-200 dark:bg-gray-700';
        }
    };

    return (
        <div
            className={`w-14 h-14 border-2 flex items-center justify-center m-1 text-2xl font-bold rounded 
        ${letter ? 'border-gray-400' : 'border-gray-300'} 
        ${status !== 'empty' ? 'text-white' : 'text-black dark:text-white'} 
        ${getBackgroundColor()} 
        transition-colors duration-500`}
        >
            {letter.toUpperCase()}
        </div>
    );
};

const GameBoard: React.FC<GameBoardProps> = ({
    cells = Array(6).fill(Array(5).fill({ letter: '', status: 'empty' })),
}) => {
    // Create a 6x5 grid
    const rows = 6;
    const cols = 5;

    const renderGrid = () => {
        const grid = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            const currentRowCells = cells[i] || Array(5).fill({ letter: '', status: 'empty' });

            for (let j = 0; j < cols; j++) {
                const cellContent = currentRowCells[j] || { letter: '', status: 'empty' };

                row.push(
                    <Cell
                        key={`cell-${i}-${j}`}
                        letter={cellContent.letter}
                        status={cellContent.status}
                    />
                );
            }

            grid.push(
                <div key={`row-${i}`} className="flex justify-center">
                    {row}
                </div>
            );
        }

        return grid;
    };

    return (
        <div className="mb-8 select-none">
            {renderGrid()}
        </div>
    );
};

export default GameBoard;

