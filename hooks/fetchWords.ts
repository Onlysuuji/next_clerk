import { useState } from "react"

// データベースから単語を取得
export const useFetchWords = (language: string) => {
    const [isFetchingWords, setIsFetchingWords] = useState<boolean>(true)
    const fetchWords = async () => {
        try {
            setIsFetchingWords(true)
            const response = await fetch(`/api/words?language=${language}`)

            if (!response.ok) {
                throw new Error('単語データの取得に失敗しました')
            }

            const data = await response.json()
            return data.words
        } catch (error) {
            console.error('単語データ取得エラー:', error)
            return []
        } finally {
            setIsFetchingWords(false)
        }
    }

    return { fetchWords, isFetchingWords }
}