import { useState, useRef } from 'react'
import { PronunciationEvaluation } from '../types'

interface PronunciationPracticeProps {
  correctAnswer: string
  setPronunciationEvaluation: (data: PronunciationEvaluation) => void
  pronunciationEvaluation: PronunciationEvaluation | null
}

export default function PronunciationPractice({
  correctAnswer,
  setPronunciationEvaluation,
  pronunciationEvaluation
}: PronunciationPracticeProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // 音声録音を開始する
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        // ストリームのトラックを停止
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('録音開始エラー:', error)
      alert('マイクへのアクセスが許可されていないか、エラーが発生しました。')
    }
  }

  // 音声録音を停止する
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // 発音を評価する
  const evaluatePronunciation = async () => {
    if (!audioBlob) return

    try {
      // 音声データをBase64エンコード
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1]
        
        if (!base64Audio) {
          throw new Error('音声データの変換に失敗しました')
        }

        setIsLoading(true)
        
        try {
          const response = await fetch('/api/speech/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioData: base64Audio,
              referenceText: correctAnswer,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || '発音評価に失敗しました')
          }

          // APIからの結果を取得し、コンソールに出力してから状態を更新
          const evaluationResult = await response.json()
          setPronunciationEvaluation(evaluationResult)
        } catch (error) {
          console.error('発音評価エラー:', error)
          alert(error instanceof Error ? error.message : '発音評価中にエラーが発生しました')
        } finally {
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('音声データ処理エラー:', error)
      alert('音声データの処理中にエラーが発生しました')
    }
  }

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h4 className="font-medium text-blue-700 mb-3">
        発音練習:
      </h4>
      <p className="text-gray-600 mb-4">
        模範解答を音読して、発音を確認しましょう。
      </p>
      
      <div className="p-4 bg-white rounded-lg border border-blue-100 mb-4">
        <p className="text-lg font-medium text-blue-800">{correctAnswer}</p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-lg font-medium ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? '録音停止' : '録音開始'}
        </button>
        
        {audioBlob && !isRecording && (
          <>
            <audio
              src={URL.createObjectURL(audioBlob)}
              controls
              className="flex-1"
            />
            <button
              onClick={evaluatePronunciation}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? '評価中...' : '発音を評価'}
            </button>
          </>
        )}
      </div>

      {/* 発音評価結果 */}
      {pronunciationEvaluation && <PronunciationResult evaluation={pronunciationEvaluation} />}
    </div>
  )
}

// 発音評価結果表示コンポーネント
function PronunciationResult({ evaluation }: { evaluation: PronunciationEvaluation }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h4 className="font-medium text-gray-700">発音評価結果</h4>
      </div>
      
      <div className="p-4">
        {/* 認識されたテキスト */}
        {evaluation.recognizedText && (
          <div className="mb-6">
            <h5 className="font-medium text-gray-700 mb-2">認識されたテキスト</h5>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <p className="text-gray-800">{evaluation.recognizedText}</p>
            </div>
          </div>
        )}
        
        {/* 総合スコア */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-700 mb-3">総合スコア</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreCard label="発音" value={evaluation.pronunciationScore} />
            <ScoreCard label="正確さ" value={evaluation.accuracyScore} />
            <ScoreCard label="流暢さ" value={evaluation.fluencyScore} />
            <ScoreCard label="完全性" value={evaluation.completenessScore} />
          </div>
        </div>
        
        {/* 単語ごとのスコア */}
        {evaluation.words && evaluation.words.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-700 mb-2">単語ごとの評価</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">単語</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">スコア</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluation.words.map((wordData, index) => {
                    const score = typeof wordData.PronunciationScore === 'number' 
                      ? Math.round(wordData.PronunciationScore) 
                      : 0;
                    
                    return (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap">{wordData.Word || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span>{score}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// スコアカードコンポーネント
function ScoreCard({ label, value }: { label: string, value: number }) {
  const score = typeof value === 'number' ? Math.round(value) : '-';
  
  return (
    <div className="bg-white p-3 rounded-lg border text-center">
      <div className="text-2xl font-bold text-blue-600">{score}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
} 