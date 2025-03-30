'use client'

import { useState } from "react"

export const useUpdateWord = () => {
    const [isUpdatingWord, setIsUpdatingWord] = useState(false)
    const [isDeletingWord, setIsDeletingWord] = useState(false)
    const updateWord = async (wordId: number, isCorrect: boolean) => {
        console.log("updateWord is", wordId, isCorrect)
        setIsUpdatingWord(true)
        const res = await fetch(`/api/word/${wordId}`, {
            method: 'PUT',
            body: JSON.stringify({ isCorrect })
        })
        if (!res.ok) {
            throw new Error("Failed to update word")
        }
        setIsUpdatingWord(false)
    }
    const deleteWord = async (wordId: number) => {
        setIsDeletingWord(true)
        const res = await fetch(`/api/word/${wordId}`, {
            method: 'DELETE'
        })
        if (!res.ok) {
            throw new Error("Failed to delete word")
        }
        setIsDeletingWord(false)
    }
    return { updateWord, isUpdatingWord, deleteWord, isDeletingWord }
}