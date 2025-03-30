'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Dropdown from '@/components/layouts/Dropdown'
import { UserButton, SignInButton, SignIn, useAuth, SignOutButton, SignedIn } from '@clerk/nextjs'
import { Sign } from 'crypto'
import { useTestLanguage } from '@/context/TestLanguageContext'

export default function Header() {
    const { language } = useTestLanguage()
    const [activeTab, setActiveTab] = useState('')
    const { isSignedIn } = useAuth()

    // タブをクリックした時のハンドラー
    const handleTabClick = (tabName: string) => {
        setActiveTab(activeTab === tabName ? '' : tabName)
    }

    return (
        <nav className={`top-0 left-0 right-0 flex h-20 justify-between shadow-[0_0_64px_0_rgba(0,0,0,0.07)] border-b-4 border-gray-100 bg-white w-full`}>
            <div className="flex justify-between md:gap-10 items-center">
                <div className="px-5">
                    <Link href="/" className="flex flex-row items-center text-black hover:text-gray-600 transition-colors duration-300 cursor-pointer">
                        <span className="mt-1 font-medium">OnlyS</span>
                        <i className="fas fa-home"></i>
                    </Link>
                </div>

                <div className="flex flex-row gap-3 text-sm md:text-lg">
                    <Dropdown
                        trigger={
                            <button
                                className="flex flex-row items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 rounded-md px-2 py-1"
                                onClick={() => handleTabClick('operation')}
                            >
                                <span className="mt-1 font-medium">操作</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    className={`icon-md text-token-text-tertiary transition-transform duration-300 ${activeTab === 'operation' ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        }
                        items={[
                            {
                                href: `/${language}`,
                                icon: <i className="fas fa-pencil-alt"></i>,
                                label: '単語の勉強'
                            },
                            {
                                href: `/${language}/register`,
                                icon: <i className="fas fa-plus"></i>,
                                label: '単語の追加'
                            },
                            {
                                href: `/${language}/wordlist`,
                                icon: <i className="fas fa-book"></i>,
                                label: '単語リスト'
                            }
                        ]}
                    />

                    <Dropdown
                        trigger={
                            <button
                                className="flex flex-row items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 rounded-md px-2 py-1"
                                onClick={() => handleTabClick('language')}
                            >
                                <span className="mt-1 font-medium">他の言語</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    className={`icon-md text-token-text-tertiary transition-transform duration-300 ${activeTab === 'language' ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        }
                        items={[
                            {
                                href: '/chinese',
                                icon: <i className="flag-icon flag-icon-cn"></i>,
                                label: '中国語'
                            },
                            {
                                href: '/english',
                                icon: <i className="flag-icon flag-icon-gb"></i>,
                                label: '英語'
                            }
                        ]}
                    />

                    <Dropdown
                        trigger={
                            <button
                                className="flex flex-row items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 rounded-md px-2 py-1"
                                onClick={() => handleTabClick('wordpack')}
                            >
                                <span className="mt-1 font-medium">単語パック</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    className={`icon-md text-token-text-tertiary transition-transform duration-300 ${activeTab === 'wordpack' ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        }
                        items={[
                            {
                                href: '/english/package',
                                label: 'パックリスト'
                            },
                            {
                                href: '/english/package/toeic',
                                label: 'TOEIC'
                            },
                            {
                                href: '/english/package',
                                label: '英検'
                            }
                        ]}
                    />
                </div>
            </div>

            <div className='flex justify-center items-center mr-5 cursor-pointer transition-transform duration-300 hover:scale-105'>
                {isSignedIn ? (
                    <>
                        <UserButton />
                    </>
                ) : <SignInButton />}
            </div>
        </nav>
    )
} 