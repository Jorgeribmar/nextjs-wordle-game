// types.ts
export type LetterState = 'correct' | 'present' | 'absent' | 'unused';

export interface CellContent {
    letter: string;
    state: LetterState;
}

export type GameStatus = 'playing' | 'won' | 'lost';

