import { Word } from '../types'

interface WordStudyCardProps {
  currentWord: Word
  count: number
  totalWords: number
  japaneseExample: string
  isLoading: boolean
}

export default function WordStudyCard({ 
  currentWord, 
  count, 
  totalWords, 
  japaneseExample, 
  isLoading 
}: WordStudyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* 進捗バー */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(count / totalWords) * 100}%` }}
        ></div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          次の日本語を英語に訳してください
        </h2>

        {/* 日本語例文 */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-12">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          ) : (
            japaneseExample
          )}
        </div>
      </div>
    </div>
  )
} 