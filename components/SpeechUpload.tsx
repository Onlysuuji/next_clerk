'use client'

import { useState, useRef } from 'react';
import { useTestLanguage } from '@/context/TestLanguageContext';
import convertWebMToWav from '@/utils/WebMToWav';
import pinyin from "pinyin";

export default function SpeechUpload({ text, children }: { text: string, children: React.ReactNode }) {
    const { language } = useTestLanguage()
    const [result, setResult] = useState<any>(null);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const pinyinText = language === "chinese" ? pinyin(text, {
        style: pinyin.STYLE_TONE, // 声調付きのピンイン
        heteronym: false // 同音異義語を表示しない
    }).flat().join(' ') : ""


    // 🎤 録音開始処理
    const startRecording = async () => {
        setResult(null); // 以前の結果をクリア

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            audioChunksRef.current = []; // 前回の録音データをクリア

            // MediaRecorderを使用してWebM形式で録音
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // 録音したチャンクからBlobを作成
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                try {
                    // WebMからWAVに変換（FFmpeg不要の方法）
                    const wavBlob = await convertWebMToWav(audioBlob);

                    // WAVをBase64に変換
                    const reader = new FileReader();

                    reader.readAsDataURL(wavBlob);
                    reader.onloadend = async () => {
                        const base64Wav = reader.result as string;
                        // Base64のヘッダー部分 (data:audio/wav;base64,) を削除
                        const base64Data = base64Wav.split(',')[1];

                        console.log("🎤 Base64 音声データ:", base64Data?.slice(0, 100) + "..."); // 最初の100文字だけ表示

                        if (!base64Data || !text) {
                            alert('録音データまたはテキストがありません。');
                            return;
                        }

                        const response = await fetch('/api/speech', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ wav: base64Data, text, language })
                        });

                        if (!response.ok) {
                            console.error("❌ APIエラー:", response.status, response.statusText);
                            try {
                                const errorData = await response.json();
                                console.error("❌ サーバーレスポンス:", errorData);
                            } catch (error) {
                                console.error("❌ サーバーレスポンスの解析に失敗:", error);
                            }
                            return;
                        }

                        try {
                            const data = await response.json();
                            setResult(data.result);
                            console.log("🎤 評価結果:", data);
                        } catch (error) {
                            console.error("❌ JSON パースエラー:", error);
                        }
                    };
                } catch (error) {
                    console.error("❌ 変換エラー:", error);
                }
            };

            mediaRecorder.start();
            setRecording(true);
            console.log("🎤 録音開始");
        } catch (error) {
            console.error("❌ 録音開始エラー:", error);
            alert("マイクのアクセスを許可してください。");
        }
    };

    // 🎤 録音停止処理
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();

            // ストリームの全てのトラックを停止
            const stream = mediaRecorderRef.current.stream;
            stream.getTracks().forEach(track => track.stop());

            setRecording(false);
            console.log("🛑 録音停止");
        }
    };

    return (
        <div>
            <h1>発音評価</h1>

            <div className="p-4 bg-white rounded-lg border border-blue-100 mb-4">

                <p className='text-lg font-medium text-blue-800'>{pinyinText}</p>
                <p className='text-lg font-medium text-blue-800'>{text}</p>
            </div>
            <div className='flex justify-between'>
                <div
                    className={`p-4 rounded-lg w-1/4 text-center cursor-pointer transition-all duration-300 ${recording
                        ? 'bg-reg-100 border-2 border-red-300 hover:bg-reg-200'
                        : 'bg-green-100 border-2 border-green-300 hover:bg-green-200'
                        }`}
                >
                    {recording ? (
                        <button
                            onClick={stopRecording}
                            className="cursor-pointer text-red-500 focus:outline-none"
                            aria-label="録音停止"
                        >
                            🛑 録音停止
                        </button>
                    ) : (
                        <button
                            onClick={startRecording}
                            className="cursor-pointer focus:outline-none"
                            aria-label="録音開始"
                        >
                            🎤 録音開始
                        </button>
                    )}
                </div>
                {children}
            </div>


            <h2>評価結果</h2>
            {result && !result.accuracyScore && (<div className='text-red-300'>音声エラー</div>)}
            {result && result.accuracyScore && (
                <div>
                    <table className='min-w-full text-center'>
                        <thead>
                            <tr>
                                <th>正確性</th>
                                <th>流暢性</th>
                                <th>完全性</th>
                                <th>発音</th>
                            </tr>
                            <tr>
                                <td>{result.accuracyScore}</td>
                                <td>{result.fluencyScore}</td>
                                <td>{result.completenessScore}</td>
                                <td>{result.pronunciationScore}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>言葉</th>
                                <th>点数</th>
                            </tr>
                            {result.detailResult?.Words?.map((word: { Word: string, PronunciationAssessment: { AccuracyScore: number } }, index: number) => (
                                <tr key={index}>
                                    {/* Render the 'Word' property of the object */}
                                    <td>{word.Word}</td>
                                    <td>{word.PronunciationAssessment.AccuracyScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
