import { useState } from "react";

const AzureLanguage: { [key: string]: string } = {
    "japanese": "ja-JP",
    "english": "en-US",
    "chinese": "zh-CN",
    "french": "fr-FR"
}

export const useFetchAudioData = () => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // 音声データをフェッチする関数
    const fetchAudioData = async (text: string, language: string, voice: string) => {
        try {
            const response = await fetch("/api/azure/text-to-speech", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, language: AzureLanguage[language], voice }),
            });

            if (!response.ok) {
                throw new Error(
                    `音声データの取得に失敗しました。\n` +
                    `Text: "${text}"\n` +
                    `Language: "${language}" (${AzureLanguage[language]})\n` +
                    `Voice: "${voice}"`
                );
            }


            // 音声データを保存
            const blob = await response.blob();
            setAudioUrl(URL.createObjectURL(blob));
        } catch (error) {
            console.error("エラー:", error);
        }
    };
    return { fetchAudioData, audioUrl }
}

