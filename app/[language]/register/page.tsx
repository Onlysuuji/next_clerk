'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

// 単語のレベル定義
const WORD_LEVELS = [
  'TOEIC 400-500',
  'TOEIC 500-600',
  'TOEIC 600-700',
  'TOEIC 700-800',
  'TOEIC 800-900'
]

export default function RegisterWord() {
  const params = useParams()
  const router = useRouter()
  const language = params.language || 'english'
  const { userId, isLoaded, isSignedIn } = useAuth()
  
  // 状態変数
  const [english, setEnglish] = useState('')
  const [japanese, setJapanese] = useState('')
  const [level, setLevel] = useState('TOEIC 600-700')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [recentWords, setRecentWords] = useState<Array<{ id: number; english: string; japanese: string; level: string }>>([])
  
  // 最近追加された単語を読み込む
  useEffect(() => {
    const loadRecentWords = async () => {
      try {
        const response = await fetch('/api/words?limit=5')
        if (response.ok) {
          const data = await response.json()
          setRecentWords(data.words)
        }
      } catch (error) {
        console.error('最近の単語の読み込みに失敗しました:', error)
      }
    }
    
    loadRecentWords()
  }, [])
  
  // フォーム送信処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // ログイン状態チェック
    if (!isLoaded || !isSignedIn) {
      setMessage({ text: 'ログインが必要です', type: 'error' })
      return
    }
    
    // バリデーション
    if (!english.trim()) {
      setMessage({ text: '英単語を入力してください', type: 'error' })
      return
    }
    
    if (!japanese.trim()) {
      setMessage({ text: '日本語訳を入力してください', type: 'error' })
      return
    }
    
    try {
      setIsSubmitting(true)
      setMessage(null)
      
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          english: english.trim(),
          japanese: japanese.trim(),
          level,
          userId: userId
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '単語の登録に失敗しました')
      }
      
      const data = await response.json()
      
      // 成功メッセージの表示
      setMessage({ text: '単語を登録しました', type: 'success' })
      
      // 最近の単語リストに追加
      setRecentWords(prev => [data.word, ...prev.slice(0, 4)])
      
      // フォームのリセット
      setEnglish('')
      setJapanese('')
      
    } catch (error) {
      console.error('単語登録エラー:', error)
      setMessage({ text: error instanceof Error ? error.message : '単語の登録に失敗しました', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 単語を削除する
  const handleDeleteWord = async (id: number) => {
    if (!confirm('この単語を削除してもよろしいですか？')) return
    
    try {
      const response = await fetch(`/api/words/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('単語の削除に失敗しました')
      }
      
      // 最近の単語リストから削除
      setRecentWords(prev => prev.filter(word => word.id !== id))
      setMessage({ text: '単語を削除しました', type: 'success' })
      
    } catch (error) {
      console.error('単語削除エラー:', error)
      setMessage({ text: error instanceof Error ? error.message : '単語の削除に失敗しました', type: 'error' })
    }
  }
  
  // ログイン状態に応じた表示
  if (isLoaded && !isSignedIn) {
    return (
      <div className="pt-24 min-h-screen bg-white flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-8 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ログインが必要です</h2>
          <p className="text-gray-600 mb-6">
            単語を登録するには、ログインまたは新規登録が必要です。
          </p>
          <a 
            href="/sign-in" 
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mr-4"
          >
            ログイン
          </a>
          <a 
            href="/sign-up" 
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            新規登録
          </a>
        </div>
      </div>
    )
  }
  
  return (
    <div className="pt-24 min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ヘッダーセクション */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              単語登録
            </h1>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-medium">
              {language === 'english' ? '英語' : language === 'chinese' ? '中国語' : language}
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            単語を登録して、自分だけの単語帳を作成しましょう。
          </p>
        </div>
        
        {/* メッセージ表示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 登録フォーム */}
          <div className="md:w-1/2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">新しい単語を追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-1">
                    英単語
                  </label>
                  <input
                    id="english"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    placeholder="例: implement"
                  />
                </div>
                
                <div>
                  <label htmlFor="japanese" className="block text-sm font-medium text-gray-700 mb-1">
                    日本語訳
                  </label>
                  <input
                    id="japanese"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={japanese}
                    onChange={(e) => setJapanese(e.target.value)}
                    placeholder="例: 実施する"
                  />
                </div>
                
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    レベル
                  </label>
                  <select
                    id="level"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {WORD_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md font-medium transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        登録中...
                      </span>
                    ) : '単語を登録する'}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">ヒント:</span> 効率的に学習するには、関連する単語をまとめて登録しましょう。
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2">単語学習のコツ</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                <li>似た意味や対義語をグループ化すると覚えやすくなります</li>
                <li>TOEICでは、ビジネス・経済関連の単語が頻出します</li>
                <li>基本的な動詞・名詞・形容詞の派生語も一緒に覚えましょう</li>
                <li>単語登録後は、例文を使った学習が効果的です</li>
              </ul>
            </div>
          </div>
          
          {/* 最近追加した単語一覧 */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">最近追加した単語</h2>
              
              {recentWords.length > 0 ? (
                <div className="space-y-3">
                  {recentWords.map((word) => (
                    <div key={word.id} className="flex justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-blue-600">{word.english}</p>
                        <p className="text-gray-600">{word.japanese}</p>
                        <p className="text-xs text-gray-500 mt-1">{word.level}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="text-red-500 hover:text-red-700 self-center"
                        aria-label="単語を削除"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  単語が登録されていません
                </div>
              )}
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push(`/${language}/wordlist`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  すべての単語を表示 →
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">TOEIC 700点に必要な単語数</h2>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">基本単語</span>
                <span className="font-medium">約3,000語</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">ビジネス・専門用語</span>
                <span className="font-medium">約1,500語</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
              
              <div className="text-sm text-gray-500 mt-3">
                効率的に学習するには、頻出単語から優先的に覚えていきましょう。
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 