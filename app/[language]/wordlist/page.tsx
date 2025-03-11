'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// 単語の型定義
interface Word {
  id: number
  english: string
  japanese: string
  level: string
  lastStudied?: string
  correctCount?: number
  incorrectCount?: number
}

// TOEIC 700点レベルの単語サンプルデータ
const TOEIC_700_WORDS: Word[] = [
  { id: 1, english: 'implement', japanese: '実施する', level: 'TOEIC 600-700', lastStudied: '2023-05-15', correctCount: 3, incorrectCount: 1 },
  { id: 2, english: 'facilitate', japanese: '促進する', level: 'TOEIC 600-700', lastStudied: '2023-05-16', correctCount: 2, incorrectCount: 0 },
  { id: 3, english: 'accommodate', japanese: '対応する、収容する', level: 'TOEIC 600-700', lastStudied: '2023-05-14', correctCount: 1, incorrectCount: 2 },
  { id: 4, english: 'leverage', japanese: '活用する', level: 'TOEIC 600-700', lastStudied: '2023-05-13', correctCount: 4, incorrectCount: 0 },
  { id: 5, english: 'enhance', japanese: '高める', level: 'TOEIC 600-700', lastStudied: '2023-05-12', correctCount: 2, incorrectCount: 1 },
  { id: 6, english: 'initiative', japanese: '率先、主導権', level: 'TOEIC 600-700', lastStudied: '2023-05-11', correctCount: 3, incorrectCount: 2 },
  { id: 7, english: 'comply', japanese: '従う', level: 'TOEIC 600-700', lastStudied: '2023-05-10', correctCount: 5, incorrectCount: 1 },
  { id: 8, english: 'procurement', japanese: '調達', level: 'TOEIC 600-700', lastStudied: '2023-05-09', correctCount: 2, incorrectCount: 3 },
  { id: 9, english: 'designation', japanese: '指定', level: 'TOEIC 600-700', lastStudied: '2023-05-08', correctCount: 1, incorrectCount: 1 },
  { id: 10, english: 'anticipate', japanese: '予測する', level: 'TOEIC 600-700', lastStudied: '2023-05-07', correctCount: 3, incorrectCount: 2 },
  { id: 11, english: 'delegate', japanese: '委任する', level: 'TOEIC 600-700', lastStudied: '2023-05-06', correctCount: 4, incorrectCount: 1 },
  { id: 12, english: 'postpone', japanese: '延期する', level: 'TOEIC 600-700', lastStudied: '2023-05-05', correctCount: 2, incorrectCount: 0 },
  { id: 13, english: 'prioritize', japanese: '優先順位をつける', level: 'TOEIC 600-700', lastStudied: '2023-05-04', correctCount: 1, incorrectCount: 1 },
  { id: 14, english: 'allocate', japanese: '割り当てる', level: 'TOEIC 600-700', lastStudied: '2023-05-03', correctCount: 3, incorrectCount: 2 },
  { id: 15, english: 'endorse', japanese: '支持する、推薦する', level: 'TOEIC 600-700', lastStudied: '2023-05-02', correctCount: 2, incorrectCount: 2 },
];

export default function WordList() {
  const params = useParams();
  const language = params.language || 'english';
  
  // 状態変数
  const [words, setWords] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Word>('english');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  
  // コンポーネントマウント時に単語を読み込む
  useEffect(() => {
    // 本番環境ではAPIからデータを取得
    // const fetchWords = async () => {
    //   const response = await fetch(`/api/words?language=${language}`);
    //   const data = await response.json();
    //   setWords(data);
    // };
    // fetchWords();
    
    // サンプルデータを使用
    setWords(TOEIC_700_WORDS);
  }, [language]);
  
  // フィルタリングと検索
  const filteredWords = words.filter(word => {
    const matchesSearch = 
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) || 
      word.japanese.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || word.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });
  
  // ソート
  const sortedWords = [...filteredWords].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  // ソート切り替え
  const toggleSort = (key: keyof Word) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  // 単語削除
  const handleDeleteWord = async (id: number) => {
    if (confirm('この単語を削除してもよろしいですか？')) {
      // 本番環境ではAPIを呼び出し
      // await fetch(`/api/words/${id}`, { method: 'DELETE' });
      
      // フロントエンドの状態を更新
      setWords(prevWords => prevWords.filter(word => word.id !== id));
    }
  };
  
  // 学習効率の計算（正解率）
  const calculateEfficiency = (correct: number = 0, incorrect: number = 0) => {
    const total = correct + incorrect;
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };
  
  // 日付フォーマット
  const formatDate = (dateString?: string) => {
    if (!dateString) return '未学習';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };
  
  return (
    <div className="pt-24 min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">単語リスト 
          <span className="ml-2 text-blue-600">
            {language === 'english' ? '(英語)' : language === 'chinese' ? '(中国語)' : ''}
          </span>
        </h1>
        
        {/* 検索とフィルター */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="単語を検索..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">全てのレベル</option>
              <option value="TOEIC 600-700">TOEIC 600-700</option>
              <option value="TOEIC 700-800">TOEIC 700-800</option>
              <option value="TOEIC 800-900">TOEIC 800-900</option>
            </select>
          </div>
          
          <div>
            <button 
              onClick={() => setWords(TOEIC_700_WORDS)} 
              className="w-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              リセット
            </button>
          </div>
        </div>
        
        {/* 単語数表示 */}
        <div className="mb-4 text-sm text-gray-600">
          全 <span className="font-semibold">{words.length}</span> 単語中 
          <span className="font-semibold ml-1">{sortedWords.length}</span> 単語を表示
        </div>
        
        {/* 単語テーブル */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('english')}
                >
                  <div className="flex items-center">
                    英語
                    {sortKey === 'english' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('japanese')}
                >
                  <div className="flex items-center">
                    日本語
                    {sortKey === 'japanese' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('level')}
                >
                  <div className="flex items-center">
                    レベル
                    {sortKey === 'level' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('lastStudied')}
                >
                  <div className="flex items-center">
                    最終学習日
                    {sortKey === 'lastStudied' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('correctCount')}
                >
                  <div className="flex items-center">
                    学習効率
                    {sortKey === 'correctCount' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedWords.map((word) => (
                <tr key={word.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-blue-600 font-medium">
                    {word.english}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {word.japanese}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      {word.level}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(word.lastStudied)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${calculateEfficiency(word.correctCount, word.incorrectCount)}%` }}
                        ></div>
                      </div>
                      <span>
                        {calculateEfficiency(word.correctCount, word.incorrectCount)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDeleteWord(word.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
              
              {sortedWords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    単語が見つかりません。検索条件を変更するか、新しい単語を追加してください。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* ページネーション（必要に応じて） */}
        {/* <div className="py-3 flex items-center justify-between border-t border-gray-200 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              前へ
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              次へ
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
} 