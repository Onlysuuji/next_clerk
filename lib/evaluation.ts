import { callOpenai } from '@/app/api/openai/callOpenai'

// 回答評価の型定義
interface AnswerEvaluation {
    isCorrect: boolean
    suggestion: string
    grammarCorrection?: string
    vocabularySuggestion?: string
    score: number
}

// ユーザーの回答を評価する
export const evaluateAnswer = async (userAnswer: string, questionExample: string, japaneseExample: string) => {
    const prompt = `
あなたは、以下の日本語例文に対するユーザーの回答の翻訳を評価するAIです。

日本語例文: ${japaneseExample.toLowerCase()}
ユーザーの回答: ${userAnswer}

次の「評価ポイント」に基づき、ユーザーの回答を評価してください。

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
}`
    try {
        const response = await callOpenai(prompt)

        // 文字列をJSONオブジェクトに変換
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            try {
                const evaluationData = JSON.parse(jsonMatch[0])
                return evaluationData as AnswerEvaluation
            } catch (e) {
                console.error('JSON解析エラー:', e)
            }
        }

        // JSONパースに失敗した場合は手動で構築
        return {
            isCorrect: false,
            suggestion: "回答を評価しました。詳細な評価情報は生成できませんでした。",
            score: 0
        }
    } catch (error) {
        console.error('回答評価エラー:', error)
        return {
            isCorrect: false,
            suggestion: "回答の評価中にエラーが発生しました。",
            score: 0
        }
    }
}