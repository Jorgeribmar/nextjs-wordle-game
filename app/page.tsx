import WordleGame from "../components/WordleGame";

export default function Home() {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-8">Wordle Game</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Guess the 5-letter word in 6 tries</p>
    </header>
    <main className="flex flex-col items-center">
        <WordleGame />
    </main>
    </div>
);
}
