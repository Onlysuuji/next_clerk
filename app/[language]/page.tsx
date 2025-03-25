'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import { Word } from '@prisma/client'
import StudyHeader from '@/components/study/StudyHeader'
import NoWordsMessage from '@/components/study/NoWordsMessage'
import QuestionCard from '@/components/study/QuestionCard'
import AnswerForm from '@/components/study/AnswerForm'
import { evaluateAnswer } from '@/lib/evaluation'
import Evaluation from '@/components/study/Evaluation'
import { useFetchWords } from '@/hooks/fetchWords'
import { useGenerateExample } from '@/hooks/generateExampleSentence'
import { useParams } from 'next/navigation'
import { fetchWordT } from '@/hooks/hasWord'
// 回答評価の型定義
interface AnswerEvaluation {
  isCorrect: boolean
  suggestion: string
  grammarCorrection?: string
  vocabularySuggestion?: string
  score: number
}

const languageMap = {
  english: "英語",
  chinese: "中国語",
  french: "フランス語",
}

export default async function StudyPage() {
  // 状態管理
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [count, setCount] = useState<number>(0)
  const [yourAnswer, setYourAnswer] = useState<string>('')
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [showPronunciationPractice, setShowPronunciationPractice] = useState(false);
  const language = useParams().language as string;
  const showLanguage = languageMap[language as keyof typeof languageMap];
  const inputRef = useRef<HTMLInputElement>(null)
  console.log(language, showLanguage)

  // データベースから単語を取得
  const { fetchWords, isFetchingWords } = useFetchWords(language)

  // 例文の生成
  const { generateExample, isLoadingExample, questionExample, japaneseExample } = useGenerateExample(showLanguage)


  // コンポーネントマウント時に単語を読み込む
  useEffect(() => {
    const initializeData = async () => {
      const fetchedWords = await fetchWords()
      setWords(fetchedWords)

      // 学習済み単語数を取得
      const studiedCount = fetchedWords.filter(
        (word: Word) => word.correctCount && word.correctCount > 0
      ).length

      setCount(studiedCount)

      if (fetchedWords.length > 0) {
        loadRandomWord(fetchedWords)
      }
    }

    initializeData()
  }, [])



  // ランダムな単語を読み込む
  const loadRandomWord = (wordList = words) => {
    if (wordList.length === 0) {
      alert('利用可能な単語がありません。単語を追加してください。')
      return
    }

    const randomIndex = Math.floor(Math.random() * wordList.length)
    const selectedWord = wordList[randomIndex]
    setCurrentWord(selectedWord)

    // 入力フィールドにフォーカス
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // 単語に基づいた例文を生成
    if (selectedWord) {
      generateExample(selectedWord)
    }
  }



  // 学習状況を更新する
  const updateWordStatus = async (wordId: number, isCorrect: boolean) => {
    try {
      if (!currentWord) return

      const response = await fetch(`/api/words/${wordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCorrect,
          lastStudied: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('学習状況の更新に失敗しました')
      }

      // ローカルステートも更新
      setWords(prevWords =>
        prevWords.map(word => {
          if (word.id === wordId) {
            return {
              ...word,
              lastStudied: new Date(),
              correctCount: (word.correctCount || 0) + (isCorrect ? 1 : 0),
              incorrectCount: (word.incorrectCount || 0) + (isCorrect ? 0 : 1)
            }
          }
          return word
        })
      )

    } catch (error) {
      console.error('学習状況更新エラー:', error)
    }
  }

  // フォーム送信時の処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (yourAnswer.trim() === '') {
      alert('回答を入力してください')
      return
    }

    setIsEvaluating(true)

    // ユーザーの回答を評価
    const evaluationResult = await evaluateAnswer(yourAnswer, questionExample, japaneseExample)

    if (evaluationResult) {
      setEvaluation(evaluationResult)
    }

    // 回答を表示
    setShowAnswer(true)

    // 学習状況を更新
    if (currentWord && evaluationResult) {
      await updateWordStatus(currentWord.id, evaluationResult.isCorrect)

    }

    // 全ての処理が完了した後に発音練習を表示
    setShowPronunciationPractice(true)
    setIsEvaluating(false)
  }

  // 次の問題へ進む
  const handleNextQuestion = () => {
    setYourAnswer('')
    setShowAnswer(false)
    setEvaluation(null)
    setShowPronunciationPractice(false)
    loadRandomWord()
  }

  // 単語を削除する
  const handleDeleteWord = async () => {
    if (!currentWord) return

    // 確認ダイアログ
    if (confirm('この単語を本当に削除しますか？')) {
      try {
        // APIを呼び出して単語を削除
        const response = await fetch(`/api/words/${currentWord.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('単語の削除に失敗しました')
        }

        // 成功したらローカルデータも更新
        setWords(prevWords => prevWords.filter(word => word.id !== currentWord.id))

        // 次の問題へ
        handleNextQuestion()
      } catch (error) {
        console.error('単語削除エラー:', error)
        alert('単語の削除中にエラーが発生しました')
      }
    }
  }

  // 読み込み中の表示
  if (isFetchingWords) {
    return (
      <div className="pt-24 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">単語データを読み込んでいます...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ヘッダーセクション */}
        <StudyHeader count={count} showLanguage={showLanguage} />

        {words.length === 0 ? (
          <NoWordsMessage />
        ) : (
          <div className="space-y-6">
            {/* 問題カード */}
            <QuestionCard count={count} words={words} isLoadingExample={isLoadingExample} yourAnswer={yourAnswer} japaneseExample={japaneseExample} showLanguage={showLanguage} />


            {/* 回答フォーム */}
            <AnswerForm
              yourAnswer={yourAnswer}
              setYourAnswer={setYourAnswer}
              handleSubmit={handleSubmit}
              handleNextQuestion={handleNextQuestion}
              handleDeleteWord={handleDeleteWord}
              isLoadingExample={isLoadingExample}
              isEvaluating={isEvaluating}
              showAnswer={showAnswer}
              inputRef={inputRef}
              showLanguage={showLanguage}
            />

            {/* 回答結果 */}
            {showAnswer && evaluation && currentWord && (
              <Evaluation evaluation={evaluation} japaneseExample={japaneseExample} questionExample={questionExample} yourAnswer={yourAnswer} showPronunciationPractice={showPronunciationPractice} />
            )}
          </div>
        )}
      </main>
    </div>
  )
} 