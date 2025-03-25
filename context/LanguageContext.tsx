"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
type LanguageContextType = {
    language: string;
    showLanguage: string;
    setLanguage: (language: string) => void;
};

const languageMap: Record<string, string> = {
    english: "英語",
    chinese: "中国語",
    french: "フランス語",
};

// 初期値（デフォルトの言語）
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const [language, setLanguage] = useState<string>(user?.publicMetadata?.language as string || "english");
    const [showLanguage, setShowLanguage] = useState<string>(languageMap[language]);

    useEffect(() => {
        const updateMetadata = async () => {
            if (user) {
                await user.update({
                    unsafeMetadata: {
                        language: language
                    }
                });
            }
        };

        setShowLanguage(languageMap[language]);
        updateMetadata();
    }, [language]);

    useEffect(() => {
        setLanguage(user?.publicMetadata?.language as string || "english");
    }, [user]);

    return (
        <LanguageContext.Provider value={{ language, showLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// `useLanguage` フックを作成（他のコンポーネントで簡単に使えるように）
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
