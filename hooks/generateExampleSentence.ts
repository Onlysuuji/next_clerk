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
            const examplePrompt = `難易度1から10の1ぐらいの、${word.question}」を使った実用的な${showLanguage}の文を1つ生成してください。日常生活での使用例が理想的です。${showLanguage}の文のみを出力してください。`
            console.log("examplePrompt is", examplePrompt)
            const generatedExample = await callOpenai(examplePrompt)
            console.log("generatedExample is", generatedExample)
            setQuestionExample(generatedExample)

            // 日本語訳を取得
            const japanesePrompt = `次の${showLanguage}文を自然な日本語に翻訳してください。翻訳のみを出力してください：${generatedExample}`
            console.log("japanesePrompt is", japanesePrompt)
            const japaneseTranslation = await callOpenai(japanesePrompt)
            console.log("japaneseTranslation is", japaneseTranslation)
            setJapaneseExample(japaneseTranslation)

        } catch (error) {
            console.error('例文生成エラー:', error)
        } finally {
            setIsLoadingExample(false)
        }
    }

    return { generateExample, isLoadingExample, questionExample, japaneseExample }
}


