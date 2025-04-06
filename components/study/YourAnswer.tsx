import { useTestLanguage } from "@/context/TestLanguageContext"

export default function YourAnswer({ children }: { children: React.ReactNode }) {
    const { showLanguage } = useTestLanguage()
    return (
        <>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                あなたの回答（{showLanguage}）
            </label>
            {children}
        </>
    )
}