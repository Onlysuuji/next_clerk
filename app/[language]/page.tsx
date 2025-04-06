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
import { HeaderComponent } from '@/components/layouts/HeaderComponent'
import YourAnswer from '@/components/study/YourAnswer'
import { TextComponent } from '@/components/study/TextComponent'
import { AdviceComponent } from '@/components/study/AdviceComponent'
export default function StudyPage() {
  // 状態管理
  const [yourAnswer, setYourAnswer] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const { language, showLanguage } = useTestLanguage()
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

  // 回答チェック
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

  // 次の問題へ
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

  return (
    <HeaderComponent>
      {!wordExists ? (
        <NoWordMessage />
      ) : (
        <div className="space-y-6">
          {/* 問題カード */}
          <QuestionCard isLoadingExample={isLoadingExample} japaneseExample={japaneseExample} />
          {/* 回答フォーム */}
          <AnswerForm>
            <YourAnswer>
              <input id="answer"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={yourAnswer}
                onChange={(e) => setYourAnswer(e.target.value)}
                ref={inputRef}
                autoCorrect="off"
                placeholder={`例文の${showLanguage}訳を入力してください...`}
                autoCapitalize="off"
                spellCheck="false"
                autoComplete="off"
                disabled={showAnswer || isLoadingExample}
              />
            </YourAnswer>
            <div className="flex justify-between h-full">
              <StudyButton showAnswer={showAnswer} handleNextQuestion={handleNextQuestion} handleAnswerCheck={handleAnswerCheck} isLoadingExample={isLoadingExample} isEvaluating={isEvaluating} />
              <TextToSpeech text={questionExample} audioUrl={audioUrl} voice={voice} setVoice={setVoice} />
              <DeleteButton deleteWord={deleteWord} isLoadingExample={isLoadingExample} word={word} />
            </div>
          </AnswerForm>

          {/* 回答結果 */}
          {evaluation && showAnswer && (
            <Evaluation evaluation={evaluation}>
              {/* 問題と回答 */}
              <div className="space-y-3">
                <TextComponent label="日本語例文" text={japaneseExample} />
                <TextComponent label="模範解答" text={questionExample} />
                <TextComponent label="あなたの回答" text={yourAnswer} />
              </div>
              <AdviceComponent evaluation={evaluation} />
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
    </HeaderComponent>
  )
} 