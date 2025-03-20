"use client";

import { createContext, useContext, ReactNode } from "react";

type LanguageContextType = {
    language: string;
    showLanguage: string;
};

// 初期値（デフォルトの言語）
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, language, showLanguage }: { children: ReactNode; language: string; showLanguage: string }) => {
    return (
        <LanguageContext.Provider value={{ language, showLanguage }}>
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
