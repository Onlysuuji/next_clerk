'use client'

import { useTestLanguage } from "@/context/TestLanguageContext"
import { callOpenai } from "@/app/api/openai/callOpenai"
import { Word } from "@prisma/client"
import { useState } from "react"

export const useGenerateExample = () => {
    const [isLoadingExample, setIsLoadingExample] = useState<boolean>(true)
    const [questionExample, setQuestionExample] = useState<string>('')
    const [japaneseExample, setJapaneseExample] = useState<string>('')

    const { showLanguage } = useTestLanguage()

    const generateExample = async (word: Word) => {
        try {
            setIsLoadingExample(true)

            // TOEIC 700点レベルに適した例文を生成
            const examplePrompt = `${word.question}の単語を使って、難易度1レベルの実用的な ${showLanguage} の文を1つ生成してください。日常生活（買い物・食事・移動など）で使うシンプルな例が理想です。文章のみを出力してください。`
            console.log("examplePrompt is", examplePrompt)
            const questionExample = await callOpenai(examplePrompt)
            console.log("questionExample is", questionExample)
            setQuestionExample(questionExample)

            // 日本語訳を取得
            const japanesePrompt = `${questionExample} を自然に翻訳してください。翻訳のみを返してください。`
            console.log("japanesePrompt is", japanesePrompt)
            const japaneseTranslation = await callOpenai(japanesePrompt)
            console.log("japaneseTranslation is", japaneseTranslation)
            setJapaneseExample(japaneseTranslation)
            return questionExample

        } catch (error) {
            console.error('例文生成エラー:', error)
        } finally {
            setIsLoadingExample(false)
        }
    }

    return { generateExample, isLoadingExample, questionExample, japaneseExample }
}


