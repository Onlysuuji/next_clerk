'use client'

import { LanguagePack, LanguageSubPack } from '@/context/TestLanguageContextType'
import { useTestLanguage } from '@/context/TestLanguageContext'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function WordPackListPage() {
  // 単語パックの定義
  const { wordPacks, showLanguage } = useTestLanguage()
  const { user } = useUser()
  const [selectedPack, setSelectedPack] = useState<LanguagePack | undefined>()
  const [selectedWordPack, setSelectedWordPack] = useState<LanguageSubPack | undefined>()
  const [ignoreList, setIgnoreList] = useState<string[]>([]);

  useEffect(() => {
    if (selectedPack) {
      setSelectedWordPack(selectedPack.subpack?.[0]);
    }
  }, [selectedPack]);

  useEffect(() => {
    setIgnoreList(user?.publicMetadata?.ignoreList as string[] || []);
  }, [user?.publicMetadata?.ignoreList]);

  const handleClick = async () => {
    if (ignoreList?.includes(selectedWordPack?.id as string)) {
      return
    }
    const res = await fetch('/api/words/seeds', {
      method: 'POST',
      body: JSON.stringify({ tag: selectedWordPack?.id }),
    })
    if (!res.ok) {
      throw new Error("エラーが発生しました");
    }
    const data = await res.json();
    if (data.success) {
      console.log("成功しました");
    } else {
      console.error("失敗:", data.message || "不明なエラー");
    }
    if (data.duplicates.length > 0) {
      console.log("重複したデータは登録されません");
      console.log("重複したデータ:", data.duplicates);
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className="text-3xl font-bold  text-center">{showLanguage}単語パック一覧</h1>
      <p className="text-gray-600 text-center  max-w-2xl mx-auto">
        目的や学習レベルに合わせた単語パックを提供しています。
        各パックには厳選された単語が含まれており、効率的に語彙力を向上させることができます。
      </p>
      <div className="w-5/6 mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-center gap-4">
          {wordPacks.map((pack: LanguagePack) => (
            <div
              key={pack.id}
              className={`w-full sm:w-1/3 md:w-1/4 lg:w-1/5 cursor-pointer text-center rounded-md border transition-transform duration-300 ease-in-out shadow-sm
          ${selectedPack?.id === pack.id
                  ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                  : 'border-gray-200 bg-white hover:bg-gray-100 hover:shadow-md hover:scale-105'
                }`}
              onClick={() => { setSelectedPack(pack); setSelectedWordPack(pack.subpack?.[0]) }}
            >
              <div className="py-4">
                <p className="text-lg font-semibold text-gray-700">{pack.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPack && (
        <div className="w-5/6 mx-auto max-w-5xl">
          <div className="flex justify-around">
            {selectedPack?.subpack?.map((pack: LanguagePack) => (
              <div key={pack.id}
                className={`w-full text-center rounded-t-md py-2 
                ${selectedWordPack?.id === pack.id
                    ? 'border-x-2 border-t-2 border-gray-200 z-10'
                    : 'border-b-2 border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-300'}`}
                onClick={() => setSelectedWordPack(pack)}
              >
                <p>{pack.tag}</p>
              </div>
            ))}
          </div>
          <div className='border-x-2 border-b-2 border-gray-200 rounded-b-md flex justify-center flex-col items-center mb-4'>
            <div className='w-2/3 text-center'>
              <p>{selectedWordPack?.description}</p>
            </div>
            <div className='w-2/3 text-center'>
              {ignoreList && ignoreList.includes(selectedWordPack?.id as string) ? (
                <button className='bg-gray-400 text-white px-4 py-2 rounded-md' >
                  この単語パックはすでに有効です
                </button>
              ) : (
                <button className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md'
                  onClick={() => { handleClick() }}
                >
                  この単語パックを有効にする
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 