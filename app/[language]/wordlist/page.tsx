'use client'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Word } from '@prisma/client';
import { useTestLanguage } from '@/context/TestLanguageContext';

export default function WordListPage() {
  // 状態管理
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('level')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { language } = useTestLanguage()

  // データをロードする
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/words?language=${language}`)

        if (!response.ok) {
          throw new Error('単語データの取得に失敗しました')
        }

        const data = await response.json()
        setWords(data.words)
      } catch (error) {
        console.error('単語データ取得エラー:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [])

  // 単語を削除する関数
  const handleDeleteWord = async (id: number) => {
    if (confirm('この単語を削除してもよろしいですか？')) {
      try {
        const response = await fetch(`/api/words/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('単語の削除に失敗しました')
        }

        // 成功したらリストを更新
        setWords(prevWords => prevWords.filter(word => word.id !== id))
      } catch (error) {
        console.error('単語削除エラー:', error)
        alert('単語の削除中にエラーが発生しました')
      }
    }
  }

  // ソート関数
  const handleSort = (column: string) => {
    // 同じカラムをクリックした場合は並び順を反転
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // 新しいカラムの場合は昇順で開始
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  // フィルタリングと検索を適用した単語リスト
  const filteredWords = words
    .filter(word =>
      // 検索語でフィルタリング
      (word.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.japanese.toLowerCase().includes(searchTerm.toLowerCase())) &&
      // レベルでフィルタリング
      (levelFilter === 'all' || word.tag === levelFilter)
    )
    .sort((a, b) => {
      // ソート処理
      let compareA: any = a[sortBy as keyof Word]
      let compareB: any = b[sortBy as keyof Word]

      // nullやundefinedを処理
      if (compareA === null || compareA === undefined) compareA = ''
      if (compareB === null || compareB === undefined) compareB = ''

      // 日付の場合は変換
      if (sortBy === 'lastStudied' && compareA && compareB) {
        compareA = new Date(compareA).getTime()
        compareB = new Date(compareB).getTime()
      }

      // 数値または文字列としてソート
      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return sortDirection === 'asc' ? compareA - compareB : compareB - compareA
      } else {
        // 文字列比較
        return sortDirection === 'asc'
          ? String(compareA).localeCompare(String(compareB))
          : String(compareB).localeCompare(String(compareA))
      }
    })

  // 学習状況を計算する関数
  const calculateProgress = (word: Word) => {
    const correct = word.correctCount || 0
    const incorrect = word.incorrectCount || 0
    const total = correct + incorrect

    if (total === 0) return 0
    return Math.floor((correct / total) * 100)
  }

  // 最後に学習した日からの経過日数を計算
  const getDaysSinceLastStudied = (lastStudied?: string) => {
    if (!lastStudied) return null

    const lastDate = new Date(lastStudied)
    const today = new Date()
    const diffTime = today.getTime() - lastDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // レベル表示用の色を取得
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // ローディング表示
  if (loading) {
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ヘッダーセクション */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              英単語リスト
            </h1>
            <Link
              href="/english/register"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              単語を追加
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            登録済みの英単語一覧です。検索やフィルタリングで単語を絞り込めます。
          </p>
        </div>

        {/* 検索・フィルタリングバー */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                検索
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="英単語または日本語で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                難易度
              </label>
              <select
                id="level"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">すべて</option>
                <option value="easy">簡単</option>
                <option value="medium">普通</option>
                <option value="hard">難しい</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                並び替え
              </label>
              <select
                id="sort"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setSortDirection('asc')
                }}
              >
                <option value="english">英単語</option>
                <option value="japanese">日本語</option>
                <option value="level">難易度</option>
                <option value="lastStudied">最終学習日</option>
                <option value="correctCount">正解数</option>
              </select>
            </div>
          </div>
        </div>

        {/* 単語リスト */}
        {filteredWords.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">条件に一致する単語がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('english')}
                  >
                    <div className="flex items-center">
                      英単語
                      {sortBy === 'english' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('japanese')}
                  >
                    <div className="flex items-center">
                      日本語
                      {sortBy === 'japanese' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('level')}
                  >
                    <div className="flex items-center">
                      難易度
                      {sortBy === 'level' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastStudied')}
                  >
                    <div className="flex items-center">
                      最終学習日
                      {sortBy === 'lastStudied' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('correctCount')}
                  >
                    <div className="flex items-center">
                      状態
                      {sortBy === 'correctCount' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWords.map((word) => (
                  <tr key={word.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {word.question}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {word.japanese}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(word.tag)}`}>
                        {word.tag === 'easy' ? '簡単' : word.tag === 'medium' ? '普通' : '難しい'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {word.lastStudied ? (
                        <div>
                          <div>{new Date(word.lastStudied).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {getDaysSinceLastStudied(word.lastStudied)}日前
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">未学習</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(word.correctCount || 0) > 0 ? (
                        <div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${calculateProgress(word)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{calculateProgress(word)}%</span>
                          </div>
                          <div className="text-xs mt-1">
                            正解: {word.correctCount || 0} / 不正解: {word.incorrectCount || 0}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">学習データなし</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* データ概要 */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h2 className="text-lg font-medium text-blue-800 mb-2">単語データ概要</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500">総単語数</div>
              <div className="text-xl font-bold text-blue-700">{words.length}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500">学習済み単語</div>
              <div className="text-xl font-bold text-green-700">
                {words.filter(w => (w.correctCount || 0) > 0).length}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500">正解率</div>
              <div className="text-xl font-bold text-yellow-700">
                {words.length > 0 ?
                  Math.floor(
                    (words.reduce((acc, word) => acc + (word.correctCount || 0), 0) /
                      words.reduce((acc, word) => acc + (word.correctCount || 0) + (word.incorrectCount || 0), 0)) * 100
                  ) || 0 : 0}%
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500">今日の学習</div>
              <div className="text-xl font-bold text-indigo-700">
                {words.filter(w => {
                  if (!w.lastStudied) return false;
                  const today = new Date();
                  const lastStudied = new Date(w.lastStudied);
                  return (
                    lastStudied.getDate() === today.getDate() &&
                    lastStudied.getMonth() === today.getMonth() &&
                    lastStudied.getFullYear() === today.getFullYear()
                  );
                }).length}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
