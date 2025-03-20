import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || '';
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const azure_language: { [key: string]: string } = {
    "english": "en-US",
    "chinese": "zh-CN",
    "french": "fr-FR",
};

export async function GET() {
    console.log("📩 API: /api/speech にリクエストを受信GET");
    return NextResponse.json({ message: "GET request received" });
}

export async function POST(req: Request, res: Response) {

    console.log("📩 API: /api/speech にリクエストを受信POST");
    try {
        const { wav, text, language } = await req.json();
        console.log("🔍 受信データ:", { text, language });
        if (!wav || !text) {
            return new Response(JSON.stringify({ error: 'Missing required fields: wav or text' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Base64 からバイナリデータに変換
        const buffer = Buffer.from(wav, 'base64');

        let assessmentResult;

        try {
            console.log("🚀 pronunciationAssessmentContinuousWithFile() を呼び出し");

            assessmentResult = await pronunciationAssessmentContinuousWithFile(buffer, text, language);

            console.log("✅ pronunciationAssessmentContinuousWithFile() 完了:", assessmentResult);

        } catch (error) {
            console.error("❌ エラー発生:", error);
        }

        return new Response(JSON.stringify({ success: true, result: assessmentResult }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        console.error(error);
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function pronunciationAssessmentContinuousWithFile(wav: Buffer, text: string, language: string) {
    return new Promise((resolve, reject) => {
        console.log("🚀 pronunciationAssessmentContinuousWithFile() が呼ばれた");

        const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
        const audioConfig = sdk.AudioConfig.fromWavFileInput(wav);

        console.log("🔍 WAV データの長さ:", wav.length, "バイト");

        speechConfig.speechRecognitionLanguage = azure_language[language];

        const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
            text,
            sdk.PronunciationAssessmentGradingSystem.HundredMark,
            sdk.PronunciationAssessmentGranularity.Phoneme,
            true
        );
        pronunciationAssessmentConfig.enableProsodyAssessment = true;

        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        pronunciationAssessmentConfig.applyTo(recognizer);
        console.log(wav)
        console.log("🎤 認識開始: startContinuousRecognitionAsync() を実行");

        recognizer.recognizing = (s, e) => {
            console.log("🔄 認識中: ", e.result.text);
        };

        recognizer.recognized = (s, e) => {
            console.log("✅ 認識成功:", e.result.text);

            const pronunciationResult = sdk.PronunciationAssessmentResult.fromResult(e.result);

            const response = {
                accuracyScore: pronunciationResult.accuracyScore,
                fluencyScore: pronunciationResult.fluencyScore,
                completenessScore: pronunciationResult.completenessScore,
                pronunciationScore: pronunciationResult.pronunciationScore,
                detailResult: pronunciationResult.detailResult
            };

            recognizer.stopContinuousRecognitionAsync(() => {
                console.log("🛑 認識を停止 (resolve を呼ぶ)");
                resolve(response);
            });
        };

        recognizer.canceled = (s, e) => {
            console.error("❌ 認識がキャンセルされた:", e.errorDetails);
            recognizer.stopContinuousRecognitionAsync(() => {
                reject(new Error("Recognition canceled: " + e.errorDetails));
            });
        };

        // ✅ `sessionStopped` では `reject()` を呼ばないように修正
        recognizer.sessionStopped = () => {
            console.log("🛑 認識セッションが終了しました");
            recognizer.stopContinuousRecognitionAsync();
        };

        recognizer.startContinuousRecognitionAsync((err) => {
            if (err) {
                console.error("❌ 認識開始エラー:", err);
                reject(new Error("startContinuousRecognitionAsync() failed: " + err));
            } else {
                console.log("🎧 認識開始成功！");
            }
        });
    });
}


