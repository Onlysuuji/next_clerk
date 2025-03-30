'use client'

import { useTestLanguage } from "@/context/TestLanguageContext";
import { useRef } from "react";
type Props = {
    yourAnswer: string;
    setYourAnswer: (value: string) => void;
    isLoadingExample: boolean;
    showAnswer: boolean;
    children: React.ReactNode;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

const AnswerForm = ({
    yourAnswer,
    setYourAnswer,
    isLoadingExample,
    showAnswer,
    inputRef,
    children
}: Props) => {
    const { showLanguage } = useTestLanguage()

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 ">
            <div className="space-y-4">
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
                {children}
            </div>
        </div>
    );
};

export default AnswerForm;
