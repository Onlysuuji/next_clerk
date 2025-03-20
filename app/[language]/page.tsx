'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import SpeechUpload from '../../components/SpeechUpload'
import { useParams } from 'next/navigation'
import { Word } from '@prisma/client'
import { callOpenai } from '../api/openai/callOpenai'
import { LanguageProvider } from '@/context/LanguageContext'
import StudyHeader from '@/components/study/StudyHeader'
import NoWordsMessage from '@/components/study/NoWordsMessage'
import QuestionCard from '@/components/study/QuestionCard'
import { evaluateAnswer } from '@/lib/evaluation'
// 回答評価の型定義
interface AnswerEvaluation {
  isCorrect: boolean
  suggestion: string
  grammarCorrection?: string
  vocabularySuggestion?: string
  score: number
}

export default function StudyPage() {
  // 状態管理
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [count, setCount] = useState<number>(0)
  const [yourAnswer, setYourAnswer] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [japaneseExample, setJapaneseExample] = useState<string>('')
  const [questionExample, setQuestionExample] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [showPronunciationPractice, setShowPronunciationPractice] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null)
  const params = useParams() as Record<string, string | string[]>;
  const language = params?.language as string
  const languageMap: Record<string, string> = {
    english: "英語",
    chinese: "中国語",
    french: "フランス語",
  };

  const showLanguage = languageMap[language] ?? "不明";

  // データベースから単語を取得
  const fetchWords = async () => {
    try {
      setDataLoading(true)
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
      setDataLoading(false)
    }
  }

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
      generateExampleSentence(selectedWord)
    }
  }

  // 例文の生成
  const generateExampleSentence = async (word: Word) => {
    try {
      setIsLoading(true)

      // TOEIC 700点レベルに適した例文を生成
      const examplePrompt = `難易度1から10の1ぐらいの、${word.question}」を使った実用的な${showLanguage}の文を1つ生成してください。日常生活での使用例が理想的です。${showLanguage}の文のみを出力してください。`

      const generatedExample = await callOpenai(examplePrompt)
      setQuestionExample(generatedExample)

      // 日本語訳を取得
      const japanesePrompt = `次の${showLanguage}文を自然な日本語に翻訳してください。翻訳のみを出力してください：${generatedExample}`
      const japaneseTranslation = await callOpenai(japanesePrompt)
      setJapaneseExample(japaneseTranslation)

      setIsLoading(false)
    } catch (error) {
      console.error('例文生成エラー:', error)
      setIsLoading(false)
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

    setIsLoading(true)

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

      // 正解の場合はカウントを増やす
      if (evaluationResult.isCorrect) {
        setCount(prev => prev + 1)
      }
    }

    // 全ての処理が完了した後に発音練習を表示
    setShowPronunciationPractice(true)
    setIsLoading(false)
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
  if (dataLoading) {
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
    <LanguageProvider {...{ language, showLanguage }}>
      <div className="pt-24 min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* ヘッダーセクション */}
          <StudyHeader count={count} />

          {words.length === 0 ? (
            <NoWordsMessage />
          ) : (
            <div className="space-y-6">
              {/* 問題カード */}
              <QuestionCard count={count} words={words} isLoading={isLoading} yourAnswer={yourAnswer} japaneseExample={japaneseExample} />

              {/* 回答フォーム */}
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
                      placeholder="例文の英語訳を入力してください..."
                      autoCapitalize="off"
                      spellCheck="false"
                      autoComplete="off"
                      disabled={showAnswer || isLoading}
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
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
                      `}
                      disabled={isLoading}
                    >
                      {isLoading ? (
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
                      disabled={isLoading || !currentWord}
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

              {/* 回答結果 */}
              {showAnswer && evaluation && currentWord && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className={`py-3 px-6 ${evaluation.isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <h3 className={`font-medium text-lg flex items-center ${evaluation.isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
                      {evaluation.isCorrect ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          正解！
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          惜しい！
                        </>
                      )}
                    </h3>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* 問題と回答 */}
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">日本語例文: </span>
                        <span className="text-gray-800">{japaneseExample}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">模範解答: </span>
                        <span className="text-green-600 font-medium">{questionExample}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">あなたの回答: </span>
                        {yourAnswer}
                      </div>
                    </div>

                    {/* 評価とアドバイス */}
                    <div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                        <div className="pl-4 border-l-2 border-blue-200">
                          <h5 className="font-medium text-blue-700 mb-1">文法の修正:</h5>
                          <p className="text-gray-600">{evaluation.suggestion}</p>
                          <p className="text-gray-600">{evaluation.score}</p>

                        </div>
                      </div>
                    </div>

                    {/* 発音練習セクション */}
                    {showPronunciationPractice && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">

                        <SpeechUpload text={questionExample} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </LanguageProvider>
  )
} 