"use client";

import { useEffect, useState } from "react";
import SpeechUpload from "./SpeechUpload";
import { callOpenai } from "../api/openai/callOpenai";

// 回答評価の型定義
interface AnswerEvaluation {
    isCorrect: boolean;
    suggestion: string;
    grammarCorrection?: string;
    vocabularySuggestion?: string;
    score: number;
}

export default function Test({
    japaneseExample,
    questionExample,
    yourAnswer,
    showPronunciationPractice,
}: {
    japaneseExample: string;
    questionExample: string;
    yourAnswer: string;
    showPronunciationPractice: boolean;
}) {
    // 評価結果の状態管理
    const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ユーザーの回答を評価する関数
    const evaluateAnswer = async (userAnswer: string, questionExample: string) => {
        const prompt = `
あなたは、以下の日本語例文に対するユーザーの英訳を評価するAIです。

日本語例文: ${japaneseExample.toLowerCase()}
模範英訳: ${questionExample}
ユーザーの回答: ${userAnswer}

次の「評価ポイント」に基づき、ユーザーの回答を具体的かつ厳密に評価してください。

評価ポイント（採点基準）：
- 文法の正確さ（0〜50点）
  - 文法的な間違いはないか
  - 時制、主語と述語の一致、冠詞、前置詞、語順などの文法的要素が正しいか
  - ケアレスミスや細かな誤りも厳密に評価する

- 自然さ・表現の適切さ（0〜50点）
  - ネイティブスピーカーが使う自然な表現であるか
  - 直訳的・不自然な表現になっていないか
  - 状況に適した英単語や言い回しを使えているか

以上を踏まえて、以下のJSON形式で評価結果を返してください。

{
  "score": 0~100,
  "isCorrect": true/false, // 81点以上ならtrue
  "suggestion": "ユーザーの回答に対する総合的な評価と改善案（日本語で具体的に記述）"
}

なお、評価は非常に厳密に行い、スコアには明確な根拠を反映してください。`;

        try {
            const response = await callOpenai(prompt);

            // 文字列をJSONオブジェクトに変換
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const evaluationData = JSON.parse(jsonMatch[0]) as AnswerEvaluation;
                    return evaluationData;
                } catch (e) {
                    console.error("JSON解析エラー:", e);
                }
            }

            // JSONパースに失敗した場合は手動で構築
            return {
                isCorrect: false,
                suggestion: "回答を評価しました。詳細な評価情報は生成できませんでした。",
                score: 0,
            };
        } catch (error) {
            console.error("回答評価エラー:", error);
            return {
                isCorrect: false,
                suggestion: "回答の評価中にエラーが発生しました。",
                score: 0,
            };
        }
    };

    // `useEffect` で評価を取得する
    useEffect(() => {
        const fetchEvaluation = async () => {
            setIsLoading(true);
            const result = await evaluateAnswer(yourAnswer, questionExample);
            setEvaluation(result);
            setIsLoading(false);
        };

        fetchEvaluation();
    }, [yourAnswer, questionExample]); // 依存配列で `yourAnswer` または `questionExample` が変更されたら再実行

    return (
        <div className="p-6 space-y-5">
            {/* 問題と回答 */}
            <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">日本語例文: </span>
                    <span className="text-gray-800">{japaneseExample}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">模範解答: </span>
                    <span className="text-green-600 font-medium">{questionExample}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">あなたの回答: </span>
                    {yourAnswer}
                </div>
            </div>

            {/* 評価とアドバイス */}
            <div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                    <div className="pl-4 border-l-2 border-blue-200">
                        <h5 className="font-medium text-blue-700 mb-1">文法の修正:</h5>
                        {isLoading ? (
                            <p className="text-gray-600">評価中...</p>
                        ) : (
                            <>
                                <p className="text-gray-600">{evaluation?.suggestion}</p>
                                <p className="text-gray-600">{evaluation?.score}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 発音練習セクション */}
            {showPronunciationPractice && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <SpeechUpload sentences={questionExample} />
                </div>
            )}
        </div>
    );
}
