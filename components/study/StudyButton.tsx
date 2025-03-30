import { useRef } from "react"

import { useEffect } from "react"

export default function StudyButton({ showAnswer, handleNextQuestion, handleAnswerCheck, isLoadingExample, isEvaluating }: { showAnswer: boolean, handleNextQuestion: () => void, handleAnswerCheck: () => void, isLoadingExample: boolean, isEvaluating: boolean }) {
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleEnterPress = async (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                buttonRef.current?.click()
            }
        }
        window.addEventListener('keydown', handleEnterPress)
        return () => window.removeEventListener('keydown', handleEnterPress)
    }, [])
    return <button
        type="button"
        ref={buttonRef}
        onClick={showAnswer ? handleNextQuestion : handleAnswerCheck}
        className={`
                        px-5 py-2 rounded-md font-medium transition-all duration-300 cursor-pointer
                        ${showAnswer
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'} 
                        ${isLoadingExample ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
                      `}
        disabled={isLoadingExample}
    >
        {isLoadingExample || isEvaluating ? (
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                準備中...
            </span>
        ) : (
            showAnswer ? '次の問題へ' : '答え合わせ'
        )}
    </button>
}
