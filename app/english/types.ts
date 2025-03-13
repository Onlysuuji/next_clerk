// 型定義ファイル
export interface Word {
  id: number
  english: string
  japanese: string
  level: string
  lastStudied?: string
  correctCount?: number
  incorrectCount?: number
}

export interface AnswerEvaluation {
  isCorrect: boolean
  correctAnswer: string
  suggestion: string
  grammarCorrection?: string
  vocabularySuggestion?: string
}

export interface PronunciationEvaluation {
  recognizedText: string;
  pronunciationScore: number;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  words: {
    Word: string;
    PronunciationScore: number;
    Duration: number;
    AccuracyScore?: number;
  }[];
  rawResult?: any;
} 