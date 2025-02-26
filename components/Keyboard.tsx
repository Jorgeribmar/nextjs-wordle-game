"use client"

import React from 'react';

import { LetterState } from './WordleGame';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    letterStates: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStates }) => {
    // QWERTY keyboard layout
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
    ];

    // Handle keyboard key click
    const handleKeyClick = (key: string) => {
        onKeyPress(key);
    };

    // Get the style class based on key status
    const getKeyClass = (key: string) => {
        const status = letterStates[key.toLowerCase()];
        const baseClass = "rounded font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

        switch (status) {
            case 'correct':
                return `${baseClass} bg-green-500 text-white hover:bg-green-600`;
            case 'present':
                return `${baseClass} bg-yellow-500 text-white hover:bg-yellow-600`;
            case 'absent':
                return `${baseClass} bg-gray-600 text-white hover:bg-gray-700`;
            default:
                return `${baseClass} bg-gray-200 text-black hover:bg-gray-300`;
        }
    };

    // Get the appropriate width for special keys
    const getKeyWidth = (key: string) => {
        if (key === 'Enter' || key === 'Backspace') {
            return 'min-w-[4.5rem] sm:min-w-[4rem]';
        }
        return 'min-w-[2rem] sm:min-w-[2.5rem]';
    };

    return (
        <div className="keyboard w-full max-w-md mx-auto mt-4">
            {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center mb-2">
                    {row.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleKeyClick(key)}
                            className={`${getKeyClass(key)} ${getKeyWidth(key)} py-3 mx-1 text-sm sm:text-base`}
                            aria-label={key}
                        >
                            {key === 'Backspace' ? '⌫' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;

