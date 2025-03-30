import { useTestLanguage } from '@/context/TestLanguageContext'

export default function StudyHeader() {
    const { showLanguage } = useTestLanguage()
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <h1 className="text-gray-600 mt-2">
                    日本語の例文を{showLanguage}に訳して、学習しましょう。
                </h1>
            </div>
        </div>
    )
}