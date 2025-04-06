import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layouts/Header'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import { TestLanguageProvider } from '@/context/TestLanguageContext'
import { jaJP } from '@clerk/localizations'
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
          <ClerkProvider localization={jaJP}>
            <SignedIn>
              <TestLanguageProvider>
                <main className="flex flex-col min-h-screen gap-3">
                  <Header />
                  {children}
                </main>
              </TestLanguageProvider>
            </SignedIn>
            <SignedOut>
              <main className="flex flex-col min-h-screen gap-3">
                <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                  <div className="max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-lg">
                    <h1 className="mb-4 text-3xl font-bold text-blue-600">OnlyS</h1>
                    <p className="mb-6 text-gray-600">効率的な言語学習をサポートする最適なツールです。ログインして学習を始めましょう。</p>
                    <div className="px-4 flex gap-2 w-full justify-between items-center">
                      <SignInButton>
                        <button className="px-6 py-2 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600">
                          ログイン
                        </button>
                      </SignInButton>
                      <p className="text-gray-600">または</p>
                      <SignUpButton>
                        <button className="px-6 py-2 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600">
                          新規登録
                        </button>
                      </SignUpButton>
                    </div>
                  </div>
                </div>
              </main>
            </SignedOut>
          </ClerkProvider>

        </div>
      </body>
    </html>
  )
}