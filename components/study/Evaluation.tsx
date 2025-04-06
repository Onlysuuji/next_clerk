import SpeechUpload from '@/components/SpeechUpload'
import { TextComponent } from './TextComponent';
import { AdviceComponent } from './AdviceComponent';

type Evaluation = {
    isCorrect: boolean;
    suggestion: string;
    score: number;
}

type Props = {
    evaluation: Evaluation;
    children: React.ReactNode;
}

export default function Evaluation({ evaluation, children }: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className={`py-3 px-6 ${evaluation.isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <h3 className={`font-medium text-lg flex items-center ${evaluation.isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
                    {evaluation.isCorrect ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            正解！
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            惜しい！
                        </>
                    )}
                </h3>
            </div>
            <div className="p-6 space-y-5">
                {/* 評価とアドバイス */}
                {children}
            </div>
        </div>
    )
}
