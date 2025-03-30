"use client"

import { useState } from "react"
import { evaluateAnswer } from "@/lib/evaluation"

// 回答評価の型定義
interface AnswerEvaluation {
    isCorrect: boolean
    suggestion: string
    grammarCorrection?: string
    vocabularySuggestion?: string
    score: number
}

export const useEvaluate = () => {
    const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null)
    const [isEvaluating, setIsEvaluating] = useState<boolean>(false)

    const evaluate = async (userAnswer: string, questionExample: string, japaneseExample: string) => {
        setIsEvaluating(true)
        const evaluation = await evaluateAnswer(userAnswer, questionExample, japaneseExample)
        setEvaluation(evaluation)
        setIsEvaluating(false)
        return evaluation
    }
    return { evaluation, isEvaluating, setEvaluation, evaluate }
}