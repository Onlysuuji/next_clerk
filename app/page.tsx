"use client";

import { useTestLanguage } from '@/context/TestLanguageContext';
import { redirect } from 'next/navigation'

export default function Home() {
  const { language } = useTestLanguage();

  // 英語学習ページにリダイレクト
  redirect(`/${language}`)

  // 以下のコードは実行されません（リダイレクトのため）
  return null
}
