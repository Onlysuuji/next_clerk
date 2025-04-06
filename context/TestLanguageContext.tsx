"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LanguagePack, LanguageContextType, wordPack, languageMap } from "./TestLanguageContextType";

export const TestLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const TestLanguageProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser()
    const [language, setLanguage] = useState<string>(user?.publicMetadata?.language as string || "english");
    const [showLanguage, setShowLanguage] = useState<string>(languageMap[language]);
    const [wordPacks, setWordPacks] = useState<LanguagePack[]>([]);
    const params = useParams()

    useEffect(() => {
        let lang = "english"
        // パラメーターから言語を取得 else ユーザーの言語を取得 else 英語を設定
        if (params.language) {
            lang = params.language as string || "english"
        }
        else if (user) {
            lang = user.publicMetadata.language as string || "english"
        }
        setLanguage(lang)
        setShowLanguage(languageMap[lang])
        setWordPacks(wordPack[lang] || [])
        fetch('/api/set-language', {
            method: 'POST',
            body: JSON.stringify({ language: lang, userId: user?.id }),
        })
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