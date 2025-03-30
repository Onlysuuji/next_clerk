import { useLanguage } from '@/context/LanguageContext';
import { redirect } from 'next/navigation'

export default function Home() {
  const { language } = useLanguage();

  // 英語学習ページにリダイレクト
  redirect(`/${language}`)

  // 以下のコードは実行されません（リダイレクトのため）
  return null
}
