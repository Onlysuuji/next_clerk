import SpeechUpload from '@/components/SpeechUpload'

type Evaluation = {
    isCorrect: boolean;
    suggestion: string;
    score: number;
}

type Props = {
    evaluation: Evaluation;
    japaneseExample: string;
    questionExample: string;
    yourAnswer: string;
    showPronunciationPractice: boolean;
}

export default function Evaluation({ evaluation, japaneseExample, questionExample, yourAnswer, showPronunciationPractice }: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className={`py-3 px-6 ${evaluation.isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <h3 className={`font-medium text-lg flex items-center ${evaluation.isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
                    {evaluation.isCorrect ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            正解！
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            惜しい！
                        </>
                    )}
                </h3>
            </div>

            <div className="p-6 space-y-5">
                {/* 問題と回答 */}
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">日本語例文: </span>
                        <span className="text-gray-800">{japaneseExample}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">模範解答: </span>
                        <span className="text-green-600 font-medium">{questionExample}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">あなたの回答: </span>
                        {yourAnswer}
                    </div>
                </div>

                {/* 評価とアドバイス */}
                <div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                        <div className="pl-4 border-l-2 border-blue-200">
                            <h5 className="font-medium text-blue-700 mb-1">文法の修正:</h5>
                            <p className="text-gray-600">{evaluation.suggestion}</p>
                            <p className="text-gray-600">{evaluation.score}</p>

                        </div>
                    </div>
                </div>

                {/* 発音練習セクション */}
                {showPronunciationPractice && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">

                        <SpeechUpload text={questionExample} />
                    </div>
                )}
            </div>
        </div>
    )
}
