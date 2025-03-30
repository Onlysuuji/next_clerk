'use client'

import { useState, FormEvent, useEffect } from 'react'
import StudyHeader from '@/components/study/StudyHeader'
import NoWordMessage from '@/components/study/NoWordMessage'
import QuestionCard from '@/components/study/QuestionCard'
import AnswerForm from '@/components/study/AnswerForm'
import Evaluation from '@/components/study/Evaluation'
import { useGenerateExample } from '@/hooks/generateExampleSentence'
import { useFetchWord } from '@/hooks/fetchWord'
import { useUpdateWord } from '@/hooks/updateWord'
import { useTestLanguage } from '@/context/TestLanguageContext'
import { useEvaluate } from '@/components/study/useEvaluate'

export default function StudyPage() {
  // 状態管理
  const [yourAnswer, setYourAnswer] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [showPronunciationPractice, setShowPronunciationPractice] = useState(false);
  const { language } = useTestLanguage()

  const { word, isFetchingWord, wordExists, fetchWord } = useFetchWord()

  // 単語の更新
  const { updateWord, isUpdatingWord, deleteWord, isDeletingWord } = useUpdateWord()

  // 例文の生成
  const { generateExample, isLoadingExample, questionExample, japaneseExample } = useGenerateExample()

  //評価の生成
  const { evaluate, isEvaluating, evaluation, setEvaluation } = useEvaluate()

  useEffect(() => {
    if (language) {
      handleNextQuestion()
    }
  }, [language])

  useEffect(() => {
    if (word && evaluation) {
      setShowAnswer(true)
      updateWord(word.id, evaluation.isCorrect)
      setShowPronunciationPractice(true)
    }
  }, [evaluation])


  useEffect(() => {
    if (word) {
      setShowAnswer(false)
      console.log("単語取得完了")
      console.log("word is", word)
      console.log(word.question)
      generateExample(word)

    }

  }, [word])

  // 次の問題へ進む
  const handleNextQuestion = () => {
    console.log("初期化中")
    setYourAnswer('')
    setEvaluation(null)
    setShowPronunciationPractice(false)
    console.log("初期化完了")
    console.log("単語取得")
    fetchWord()
  }

  // フォーム送信時の処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (yourAnswer.trim() === '') {
      alert(`回答を入力してください${questionExample}, ${japaneseExample}`)
      return
    }

    evaluate(yourAnswer, questionExample, japaneseExample)

  }

  return (
    <div className="pt-24 min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ヘッダーセクション */}
        <StudyHeader />

        {!wordExists ? (
          <NoWordMessage />
        ) : (
          <div className="space-y-6">
            {/* 問題カード */}
            <QuestionCard
              isLoadingExample={isLoadingExample}
              japaneseExample={japaneseExample}
            />


            {/* 回答フォーム */}
            <AnswerForm
              word={word}
              yourAnswer={yourAnswer}
              setYourAnswer={setYourAnswer}
              handleSubmit={handleSubmit}
              handleNextQuestion={handleNextQuestion}
              handleDeleteWord={deleteWord}
              isLoadingExample={isLoadingExample}
              isEvaluating={isEvaluating}
              showAnswer={showAnswer}
            />

            {/* 回答結果 */}
            {evaluation && showAnswer && (
              <Evaluation
                evaluation={evaluation}
                japaneseExample={japaneseExample}
                questionExample={questionExample}
                yourAnswer={yourAnswer}
                showPronunciationPractice={showPronunciationPractice}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
} 