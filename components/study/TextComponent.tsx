export const TextComponent = ({ label, text }: { label: string, text: string }) => {
    return (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-medium text-gray-700">{label}: </span>
            <span className="text-gray-800">{text}</span>
        </div>
    )
}
