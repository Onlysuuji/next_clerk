import Link from "next/link"
import { useTestLanguage } from "@/context/TestLanguageContext"

export default function NoWordMessage() {
    const { language } = useTestLanguage()
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-yellow-700 mb-2">単語が登録されていません</h3>
            <p className="text-yellow-600 mb-4">
                学習するには、まず単語を登録してください。
            </p>
            <div className="flex justify-center gap-8">
                <Link
                    href={`/${language}/register`}
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    単語登録ページへ
                </Link>
                <Link
                    href={`/${language}/package`}
                    className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    単語パック一覧へ
                </Link>
            </div>

        </div>
    )
}
