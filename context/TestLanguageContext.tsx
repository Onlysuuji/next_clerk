"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type LanguageContextType = {
    language: string;
    showLanguage: string;
    setLanguage: (language: string) => void;
    wordPacks: LanguagePack[];
};

export type LanguagePack = {
    id: string;
    tag: string;
    description: string;
    imageUrl: string;
    link: string;
    subpack?: LanguageSubPack[];
}

export type LanguageSubPack = {
    id: string;
    tag: string;
    description: string;
    imageUrl: string;
    link: string;
}

const languageMap: Record<string, string> = {
    english: "英語",
    chinese: "中国語",
    french: "フランス語",
};

const wordPack: Record<string, LanguagePack[]> = {
    english: [
        {
            id: 'toeic',
            tag: 'TOEIC',
            description: 'TOEICの目標スコアに合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=TOEIC',
            link: '/english/package/toeic',
            subpack: [
                {
                    id: 'toeic500',
                    tag: 'TOEIC500',
                    description: 'TOEIC500の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=TOEIC500',
                    link: '/english/package/toeic/500'
                },
                {
                    id: 'toeic700',
                    tag: 'TOEIC700',
                    description: 'TOEIC700の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=TOEIC700',
                    link: '/english/package/toeic/700'
                },
                {
                    id: 'toeic900',
                    tag: 'TOEIC900',
                    description: 'TOEIC900の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=TOEIC900',
                    link: '/english/package/toeic/900'
                }
            ]
        },
        {
            id: 'eiken',
            tag: '英検',
            description: '英検の級別に合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=Eiken',
            link: '/english/package/eiken',
            subpack: [
                {
                    id: 'eiken3',
                    tag: '英検3級',
                    description: '英検3級の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=Eiken3',
                    link: '/english/package/eiken/3'
                },
                {
                    id: 'eiken4',
                    tag: '英検4級',
                    description: '英検4級の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=Eiken4',
                    link: '/english/package/eiken/4'
                },
            ]
        },
    ],
    chinese: [
        {
            id: 'hsk',
            tag: 'HSK',
            description: 'HSKの級別に合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=HSK',
            link: '/chinese/package/hsk',
            subpack: [
                {
                    id: 'hsk4',
                    tag: 'HSK4',
                    description: 'HSK4の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=HSK4',
                    link: '/chinese/package/hsk/4'
                },
                {
                    id: 'hsk5',
                    tag: 'HSK5',
                    description: 'HSK5の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=HSK5',
                    link: '/chinese/package/hsk/5'
                },
                {
                    id: 'hsk6',
                    tag: 'HSK6',
                    description: 'HSK6の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=HSK6',
                    link: '/chinese/package/hsk/6'
                },
            ]
        },
    ],
    french: [
        {
            id: 'DELF',
            tag: 'フランス語',
            description: 'フランス語の目標スコアに合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=French',
            link: '/french/package/fr',
            subpack: [
                {
                    id: 'A1',
                    tag: 'A1',
                    description: 'A1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/A1'
                },
                {
                    id: 'A2',
                    tag: 'A2',
                    description: 'A2の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/A2'
                },
                {
                    id: 'B1',
                    tag: 'B1',
                    description: 'B1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/B1'
                },
                {
                    id: 'B2',
                    tag: 'B2',
                    description: 'B2の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/B2'
                },
                {
                    id: 'C1',
                    tag: 'C1',
                    description: 'C1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/C1'
                },
                {
                    id: 'C1',
                    tag: 'C1',
                    description: 'C1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/C1'
                },
                {
                    id: 'C2',
                    tag: 'C2',
                    description: 'C2の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/C2'
                },
            ]
        },
    ],
};

export const TestLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const TestLanguageProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser()
    const [language, setLanguage] = useState<string>(user?.publicMetadata?.language as string | "");
    const [showLanguage, setShowLanguage] = useState<string>("");
    const [wordPacks, setWordPacks] = useState<LanguagePack[]>([]);
    const params = useParams()

    useEffect(() => {
        if (user?.publicMetadata?.language) {
            const metadataLang = user.publicMetadata.language as string;
            setLanguage(metadataLang);
            setShowLanguage(languageMap[metadataLang]);
            setWordPacks(wordPack[metadataLang] || []);
        }
    }, [user]);

    useEffect(() => {
        if (params.language && user && languageMap[params.language as string]) {
            const lang = params.language as string
            setLanguage(lang)
            setShowLanguage(languageMap[lang])
            setWordPacks(wordPack[lang] || [])
            fetch('/api/set-language', {
                method: 'POST',
                body: JSON.stringify({ language: lang, userId: user.id }),
            })
        }
    }, [params.language, user])

    return (
        <TestLanguageContext.Provider value={{ language, showLanguage, setLanguage, wordPacks }}>
            {children}
        </TestLanguageContext.Provider>
    );
};

export const useTestLanguage = () => {
    const context = useContext(TestLanguageContext);
    if (!context) {
        throw new Error("useTestLanguage must be used within a TestLanguageProvider");
    }
    return context;
};