import { TOEIC_LEVELS, WORD_TYPE } from "@/lib/toeicword";
import { useState } from "react";

export default function Package(registerWords: () => void) {
    const [targetScore, setTargetScore] = useState<string | null>(null)
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
    const [wordList, setWordList] = useState<WORD_TYPE[]>([])
    const [selectedWords, setSelectedWords] = useState<WORD_TYPE[]>([])
    const [isRegistering, setIsRegistering] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [message, setMessage] = useState('')

    return (
        <div className="container mx-auto max-w-4xl px-4 py-24">
            <h1 className="text-3xl font-bold mb-8 text-center">TOEICスコア別単語パック</h1>

            {/* 目標スコア選択部分 */}
            <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">目標スコアを選択</h2>
                <p className="mb-4 text-gray-600">
                    あなたの目標TOEICスコアに合わせた単語パックを提供します。
                    スコアが高いほど、より難しい単語が含まれます。
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {TOEIC_LEVELS.map((level) => (
                        <button
                            key={level.tag}
                            onClick={() => setTargetScore(level.tag)}
                            className={`py-3 px-4 rounded-lg border transition-all ${targetScore === level.tag
                                ? 'bg-blue-500 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <span className="block font-bold text-lg">{level.tag}</span>
                            <span className="block text-xs mt-1">約{level.words}単語</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 単語リスト表示部分 */}
            {selectedLevel && wordList.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {selectedLevel}の単語の例
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordList.length}単語)
                            </span>
                        </h2>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">英単語</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日本語</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {wordList.map((word, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            selectedWords.some(w => w.question === word.question)
                                                ? 'bg-blue-50'
                                                : 'hover:bg-gray-50'
                                        }
                                    >
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            ●
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap font-medium">{word.question}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">{word.japanese}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 登録ボタン */}
            {selectedLevel && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            {message && (
                                <p className={`mt-1 text-sm ${message.includes('失敗') ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                    {message}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={registerWords}
                            disabled={isRegistered}
                            className={`px-6 py-3 rounded-lg font-medium text-white ${isRegistered
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                }`}
                        >
                            {isRegistered ? '登録済み' : 'このレベルの単語を登録する'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
