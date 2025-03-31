'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
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
import SpeechUpload from '@/components/SpeechUpload'
import TextToSpeech from '@/components/study/TextToSpeech'
import StudyButton from '@/components/study/StudyButton'
import DeleteButton from '@/components/study/DeleteButton'
import { useFetchAudioData } from '@/hooks/fetchAudioData'
import { VOICE_OPTIONS } from '@/constants/VoiceOptions'
export default function StudyPage() {
  // 状態管理
  const [yourAnswer, setYourAnswer] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const { language } = useTestLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [voice, setVoice] = useState(VOICE_OPTIONS[language]?.[0]?.id || "");

  const { fetchAudioData, audioUrl } = useFetchAudioData()


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
    if (voice && questionExample) {
      console.log("fetchAudioData in voiceUseEffect")
      fetchAudioData(questionExample, language, voice)
    }
  }, [voice])

  const handleNextQuestion = async () => {
    try {
      // ✅ 入力・評価の初期化
      setYourAnswer("");
      setEvaluation(null);
      setShowAnswer(false);

      // ✅ エラー処理付きで単語取得
      const word = await fetchWord();
      if (!word) {
        throw new Error("単語の取得に失敗しました");
      }

      // ✅ 例文生成（エラー処理付き）
      const result = await generateExample(word);
      const questionExample = result || "";

      // ✅ 音声データの取得
      const selectedVoice = voice || VOICE_OPTIONS[language]?.[0]?.id || "";
      if (questionExample) {
        fetchAudioData(questionExample, language, selectedVoice);
      } else {
        console.warn("例文が生成されませんでした。音声は取得されません。");
      }

      // ✅ 入力欄にフォーカス
      inputRef.current?.focus();
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };


  // フォーム送信時の処理
  const handleAnswerCheck = async () => {
    if (yourAnswer.trim() === '') {
      alert(`回答を入力してください${questionExample}, ${japaneseExample}`)
      return
    }

    const evaluation = await evaluate(yourAnswer, questionExample, japaneseExample)
    setShowAnswer(true)
    if (word?.id) {
      updateWord(word.id, evaluation.isCorrect)
    }
  }

  return (
    <div className="bg-white">
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
              yourAnswer={yourAnswer}
              setYourAnswer={setYourAnswer}
              isLoadingExample={isLoadingExample}
              showAnswer={showAnswer}
              inputRef={inputRef}
            >

              <div className="flex justify-between h-full">
                <StudyButton
                  showAnswer={showAnswer}
                  handleNextQuestion={handleNextQuestion}
                  handleAnswerCheck={handleAnswerCheck}
                  isLoadingExample={isLoadingExample}
                  isEvaluating={isEvaluating}
                />

                <TextToSpeech text={questionExample} audioUrl={audioUrl} voice={voice} setVoice={setVoice} />
                <DeleteButton deleteWord={deleteWord} isLoadingExample={isLoadingExample} word={word} />
              </div>
            </AnswerForm>

            {/* 回答結果 */}
            {evaluation && showAnswer && (
              <Evaluation
                evaluation={evaluation}
                japaneseExample={japaneseExample}
                questionExample={questionExample}
                yourAnswer={yourAnswer}
              >
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">

                  <SpeechUpload text={questionExample} >
                    <TextToSpeech text={questionExample} audioUrl={audioUrl} voice={voice} setVoice={setVoice} />
                  </SpeechUpload>
                </div>
              </Evaluation>
            )}
          </div>
        )
        }
      </main >
    </div >
  )
} 