"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { words } from '../data/words';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import { CellContent, LetterState, GameStatus } from '../types';


const WordleGame: React.FC = () => {
    const [solution, setSolution] = useState<string>('');
    const [guesses, setGuesses] = useState<CellContent[][]>(
        Array(6).fill(null).map(() =>
            Array(5).fill(null).map(() => ({ letter: '', state: 'unused' }))
        )
    );
    const [currentRow, setCurrentRow] = useState<number>(0);
    const [currentCol, setCurrentCol] = useState<number>(0);
    const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
    const [keyboardStatus, setKeyboardStatus] = useState<Record<string, LetterState>>({});
    const [message, setMessage] = useState<string>('');

    // Initialize the game with a random word
    useEffect(() => {
        startNewGame();
    }, []);

    // Function to start a new game
    const startNewGame = () => {
        // Select a random word from the word list
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setSolution(randomWord.toLowerCase());

        // Reset game state
        setGuesses(
            Array(6).fill(null).map(() =>
                Array(5).fill(null).map(() => ({ letter: '', state: 'unused' }))
            )
        );
        setCurrentRow(0);
        setCurrentCol(0);
        setGameStatus('playing');
        setKeyboardStatus({});
        setMessage('');

        console.log('New game started! Solution:', randomWord);
    };



    // Handle key press from the keyboard component
    const handleKeyPress = useCallback((key: string) => {
        if (gameStatus !== 'playing') return;

        // Function to check the current guess against the solution
        const checkGuess = (guess: string) => {
            const solutionLetters = solution.split('');
            const newGuesses = [...guesses];
            const letterStates: Record<string, LetterState> = {};

            // First pass: mark correct letters
            for (let i = 0; i < 5; i++) {
                if (guess[i] === solutionLetters[i]) {
                    newGuesses[currentRow][i].state = 'correct';
                    letterStates[guess[i]] = 'correct';
                    // Mark this letter as used
                    solutionLetters[i] = '#';
                }
            }

            // Second pass: mark present and absent letters
            for (let i = 0; i < 5; i++) {
                if (newGuesses[currentRow][i].state !== 'correct') {
                    const letterIndex = solutionLetters.indexOf(guess[i]);

                    if (letterIndex !== -1) {
                        newGuesses[currentRow][i].state = 'present';
                        // Only update if the letter doesn't already have 'correct' status
                        if (letterStates[guess[i]] !== 'correct') {
                            letterStates[guess[i]] = 'present';
                        }
                        // Mark this letter as used
                        solutionLetters[letterIndex] = '#';
                    } else {
                        newGuesses[currentRow][i].state = 'absent';
                        // Only update if the letter doesn't already have 'correct' or 'present' status
                        if (!letterStates[guess[i]]) {
                            letterStates[guess[i]] = 'absent';
                        }
                    }
                }
            }

            // Update the guesses and keyboard status
            setGuesses(newGuesses);
            setKeyboardStatus(prevStatus => ({
                ...prevStatus,
                ...Object.fromEntries(
                    Object.entries(letterStates).map(([letter, state]) => {
                        // Only "upgrade" the status (absent < present < correct)
                        const currentState = prevStatus[letter];
                        if (!currentState ||
                            (currentState === 'absent' && (state === 'present' || state === 'correct')) ||
                            (currentState === 'present' && state === 'correct')) {
                            return [letter, state];
                        }
                        return [letter, currentState];
                    })
                )
            }));

            // Check if the player has won
            if (guess === solution) {
                setGameStatus('won');
                setMessage('Congratulations! You won!');
                return;
            }

            // Move to the next row or end the game
            if (currentRow < 5) {
                setCurrentRow(currentRow + 1);
                setCurrentCol(0);
            } else {
                setGameStatus('lost');
                setMessage(`Game over! The word was ${solution.toUpperCase()}`);
            }
        };

        // Handle letter keys
        if (/^[a-zA-Z]$/.test(key) && key.length === 1) {
            if (currentCol < 5) {
                const newGuesses = [...guesses];
                newGuesses[currentRow][currentCol] = {
                    letter: key.toLowerCase(),
                    state: 'unused'
                };
                setGuesses(newGuesses);
                setCurrentCol(currentCol + 1);
            }
        }
        // Handle backspace
        else if (key === 'Backspace' || key === '←') {
            if (currentCol > 0) {
                const newGuesses = [...guesses];
                newGuesses[currentRow][currentCol - 1] = {
                    letter: '',
                    state: 'unused'
                };
                setGuesses(newGuesses);
                setCurrentCol(currentCol - 1);
            }
        }
        // Handle enter key
        else if (key === 'Enter') {
            // Check if the current row is complete
            if (currentCol === 5) {
                const currentGuess = guesses[currentRow].map(g => g.letter).join('');

                // Simple validation - could be expanded to check if it's a valid word
                if (currentGuess.length !== 5) {
                    setMessage('Not enough letters');
                    return;
                }

                // Check the guess against the solution
                checkGuess(currentGuess);
            } else {
                setMessage('Not enough letters');
            }
        }
    }, [currentRow, currentCol, guesses, gameStatus, solution]);

    // Callback for keyboard events
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        handleKeyPress(e.key);
    }, [handleKeyPress]);

    // Add and remove event listener for keyboard
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Wordle Game</h1>

            {message && (
                <div className="bg-gray-100 p-2 mb-4 rounded text-center w-full">{message}</div>
            )}

            <GameBoard cells={guesses} />

            {gameStatus !== 'playing' && (
                // Show the solution when the game is over
                <div className="mt-4 text-center">
                    <p className="font-bold">Solution:</p>
                    <p className="text-xl">{solution.toUpperCase()}</p>
                </div>
            )}

            <div className="mt-6">
                <Keyboard onKeyPress={handleKeyPress} letterStates={keyboardStatus} />
            </div>

            {gameStatus !== 'playing' && (
                <>
                    <button
                        onClick={startNewGame}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        New Game
                    </button>

                </>
            )}
        </div>
    );
};

export default WordleGame;

