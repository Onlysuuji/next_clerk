'use client'

import { useParams } from "next/navigation";

const languageMap = {
    english: "英語",
    japanese: "日本語",
    spanish: "スペイン語",
    french: "フランス語",
    german: "ドイツ語",
}

export const useLanguageUtil = () => {
    const language = useParams().language as string;
    const showLanguage = languageMap[language as keyof typeof languageMap];
    return { language, showLanguage };
}
