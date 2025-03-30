'use client'

import { useTestLanguage } from '@/context/TestLanguageContext'
import Link from 'next/link'

export default function WordPackListPage() {
  // 単語パックの定義
  const { wordPacks, showLanguage, language } = useTestLanguage()

  console.log(wordPacks)
  console.log(showLanguage)
  console.log(language)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-24">
      <h1 className="text-3xl font-bold mb-8 text-center">{showLanguage}単語パック一覧</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        目的や学習レベルに合わせた単語パックを提供しています。
        各パックには厳選された単語が含まれており、効率的に語彙力を向上させることができます。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {wordPacks.map(pack => (
          <div key={pack.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src={pack.imageUrl}
                alt={`${pack.title}パック`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{pack.title}</h2>
              <p className="text-gray-600 mb-4">{pack.description}</p>
              <Link
                href={pack.link}
                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                単語を見る
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 