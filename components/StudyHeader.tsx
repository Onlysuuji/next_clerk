import { useLanguage } from '@/context/LanguageContext';

export default function StudyHeader({ count }: { count: number }) {
    const { showLanguage } = useLanguage();
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <h1 className="text-gray-600 mt-2">
                    日本語の例文を{showLanguage}に訳して、学習しましょう。
                </h1>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-medium">
                    学習済み: {count} 単語
                </div>
            </div>
        </div>
    )
}