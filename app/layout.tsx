import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layouts/Header'
import { ClerkProvider } from '@clerk/nextjs'
import { TestLanguageProvider } from '@/context/TestLanguageContext'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'OnlyS',
  description: '言語学習アプリケーション',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.3/css/flag-icons.min.css" />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <ClerkProvider>
            <TestLanguageProvider>
              <Header />
              <main className="py-24">
                {children}
              </main>
            </TestLanguageProvider>
          </ClerkProvider>

        </div>
      </body>
    </html>
  )
}