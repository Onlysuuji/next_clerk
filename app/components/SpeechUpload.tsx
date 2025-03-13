'use client'

import { divide } from 'lodash';
import { useState, useRef } from 'react';

export default function SpeechUpload({ sentences }: { sentences: string }) {
    const [text, setText] = useState(sentences);
    const [result, setResult] = useState<any>(null);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // 🎤 テキスト変更処理
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    // WebMからWAVに変換する関数
    const convertWebMToWav = async (webmBlob: Blob): Promise<Blob> => {
        // AudioContextを作成
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // WebMデータをArrayBufferに変換
        const arrayBuffer = await webmBlob.arrayBuffer();

        // ArrayBufferをデコード
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // WAVデータを作成するためのバッファを用意
        const numberOfChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length;
        const sampleRate = audioBuffer.sampleRate;
        const wavBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);

        // 各チャンネルのデータをコピー
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            wavBuffer.copyToChannel(channelData, channel);
        }

        // WAVエンコーディング用の関数
        const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
            const numChannels = audioBuffer.numberOfChannels;
            const sampleRate = audioBuffer.sampleRate;
            const format = 1; // PCM
            const bitDepth = 16;

            const buffer = new ArrayBuffer(44 + audioBuffer.length * numChannels * (bitDepth / 8));
            const view = new DataView(buffer);

            // WAVヘッダーを書き込む
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + audioBuffer.length * numChannels * (bitDepth / 8), true);
            writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, format, true);
            view.setUint16(22, numChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
            view.setUint16(32, numChannels * (bitDepth / 8), true);
            view.setUint16(34, bitDepth, true);
            writeString(view, 36, 'data');
            view.setUint32(40, audioBuffer.length * numChannels * (bitDepth / 8), true);

            // オーディオデータを書き込む
            const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
                for (let i = 0; i < input.length; i++, offset += 2) {
                    const s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            };

            let offset = 44;
            for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                floatTo16BitPCM(view, offset, audioBuffer.getChannelData(i));
                offset += audioBuffer.length * 2;
            }

            return new Blob([buffer], { type: 'audio/wav' });
        };

        const writeString = (view: DataView, offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        return encodeWAV(wavBuffer);
    };

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
                            body: JSON.stringify({ wav: base64Data, text })
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
                <p className='text-lg font-medium text-blue-800'>{text}</p>
            </div>
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
                            {result.detailResult?.Words?.map((word, index) => (
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
