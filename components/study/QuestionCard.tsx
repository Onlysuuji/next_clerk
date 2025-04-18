import { useTestLanguage } from '@/context/TestLanguageContext'

export default function QuestionCard({ isLoadingExample, japaneseExample }: { isLoadingExample: boolean, japaneseExample: string }) {
    const { showLanguage } = useTestLanguage()
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                    次の日本語を{showLanguage}に訳してください
                </h2>

                {/* 日本語例文 */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-lg">
                    {isLoadingExample ? (
                        <div className="flex justify-center items-center h-12">
                            <div className="animate-pulse flex space-x-2">
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    ) : (
                        japaneseExample
                    )}
                </div>
            </div>
        </div>
    )
}
