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
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

const languageMap: Record<string, string> = {
    english: "英語",
    chinese: "中国語",
    french: "フランス語",
};

const languagePack: Record<string, LanguagePack[]> = {
    english: [
        {
            id: 'toeic',
            title: 'TOEIC',
            description: 'TOEICの目標スコアに合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=TOEIC',
            link: '/english/package/toeic'
        },
        {
            id: 'eiken',
            title: '英検',
            description: '英検の級別に合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=英検',
            link: '/english/package'
        },
    ],
    chinese: [
        {
            id: 'hsk',
            title: 'HSK',
            description: 'HSKの級別に合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=HSK',
            link: '/chinese/package/hsk'
        },
    ],
};

export const TestLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const TestLanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<string>("");
    const [showLanguage, setShowLanguage] = useState<string>("");
    const [wordPacks, setWordPacks] = useState<LanguagePack[]>([]);
    const params = useParams()
    const { user } = useUser()

    useEffect(() => {
        if (user?.publicMetadata?.language) {
            const metadataLang = user.publicMetadata.language as string;
            setLanguage(metadataLang);
            setShowLanguage(languageMap[metadataLang]);
            setWordPacks(languagePack[metadataLang] || []);
        }
    }, [user]);

    useEffect(() => {
        if (params.language && user) {
            const lang = params.language as string
            setLanguage(lang)
            setShowLanguage(languageMap[lang])
            setWordPacks(languagePack[lang] || [])
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