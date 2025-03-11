import { redirect } from 'next/navigation'

export default function Home() {
  // 英語学習ページにリダイレクト
  redirect('/english')
  
  // 以下のコードは実行されません（リダイレクトのため）
  return null
}
