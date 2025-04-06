type Evaluation = {
    isCorrect: boolean;
    suggestion: string;
    score: number;
}

export const AdviceComponent = ({ evaluation }: { evaluation: Evaluation }) => {
    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
            <div className="pl-4 border-l-2 border-blue-200">
                <h5 className="font-medium text-blue-700 mb-1">文法の修正:</h5>
                <p className="text-gray-600">{evaluation.suggestion}</p>
                <p className="text-gray-600">{evaluation.score}</p>
            </div>
        </div>
    )
}
