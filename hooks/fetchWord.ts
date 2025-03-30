'use client'

import { useTestLanguage } from "@/context/TestLanguageContext"
import { Word } from "@prisma/client"
import { useState } from "react"

export const useFetchWord = () => {
    const [word, setWord] = useState<Word | null>(null)
    const [isFetchingWord, setIsFetchingWord] = useState(false)
    const [wordExists, setWordExists] = useState(true)
    const { language } = useTestLanguage()

    const fetchWord = async () => {
        setIsFetchingWord(true)
        try {
            const res = await fetch(`/api/word?language=${language}`)
            if (!res.ok) throw new Error("Failed to fetch word")
            const data = await res.json()
            if (data === null) {
                setWord(null)
                setWordExists(false)
            } else {
                setWord(data)
                setWordExists(true)
            }
        } catch (error) {
            console.error(error)
            setWord(null)
            setWordExists(false)
        } finally {
            setIsFetchingWord(false)
        }
    }


    return { word, isFetchingWord, wordExists, fetchWord }
}