export default function NoWordsMessage() {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-yellow-700 mb-2">単語が登録されていません</h3>
            <p className="text-yellow-600 mb-4">
                学習するには、まず単語を登録してください。
            </p>
            <a
                href="/english/register"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                単語登録ページへ
            </a>
        </div>
    )
}
