"use client";
type Props = {
    yourAnswer: string;
    setYourAnswer: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleNextQuestion: () => void;
    handleDeleteWord: () => void;
    isLoadingExample: boolean;
    showAnswer: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    isEvaluating: boolean;
    showLanguage: string;
};

const AnswerForm = ({
    yourAnswer,
    setYourAnswer,
    handleSubmit,
    handleNextQuestion,
    handleDeleteWord,
    isLoadingExample,
    showAnswer,
    inputRef,
    isEvaluating,
    showLanguage,
}: Props) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                        あなたの回答（{showLanguage}）
                    </label>
                    <input
                        id="answer"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={yourAnswer}
                        onChange={(e) => setYourAnswer(e.target.value)}
                        ref={inputRef}
                        autoCorrect="off"
                        placeholder={`例文の${showLanguage}訳を入力してください...`}
                        autoCapitalize="off"
                        spellCheck="false"
                        autoComplete="off"
                        disabled={showAnswer || isLoadingExample}
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type={showAnswer ? 'button' : 'submit'}
                        onClick={showAnswer ? handleNextQuestion : undefined}
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

                    <button
                        type="button"
                        onClick={handleDeleteWord}
                        className="px-5 py-2 bg-red-100 text-red-600 rounded-md font-medium hover:bg-red-200 transition-all duration-300 cursor-pointer"
                        disabled={isLoadingExample}
                    >
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            削除
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnswerForm;
