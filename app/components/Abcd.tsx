'use client'

export default function Abcd({title, sentence, color }: { title: string; sentence: string; color?: string }) {
    const getColoredText = () => {
        switch (color) {
            case 'red':
                return <span className="text-red-500">{sentence}</span>
            case 'green':
                return <span className="text-green-500">{sentence}</span>
            case 'blue':
                return <span className="text-blue-500">{sentence}</span>
            default:
                return <span className="text-gray-700">{sentence}</span>
        }
    }

    return (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-medium text-gray-700">{title}:　</span>
            {getColoredText()}
        </div>
    )
}
