export const TOEIC_LEVELS = [
    { tag: 'toeic400', words: 50 },
    { tag: 'toeic500', words: 100 },
    { tag: 'toeic600', words: 150 },
    { tag: 'toeic700', words: 200 },
    { tag: 'toeic800', words: 250 },
    { tag: 'toeic900', words: 300 },
]

export type WORD_TYPE = {
    question: string;
    japanese: string;
}

export const SAMPLE_WORDS: { [key: string]: WORD_TYPE[] } = {
    'toeic400': [
        { question: 'apple', japanese: 'りんご' },
        { question: 'book', japanese: '本' },
        { question: 'cat', japanese: '猫' },
        { question: 'dog', japanese: '犬' },
        { question: 'water', japanese: '水' },
        // 残りのBeginner単語...
    ],
    'toeic500': [
        { question: 'accomplish', japanese: '達成する' },
        { question: 'benefit', japanese: '利益' },
        { question: 'crucial', japanese: '重要な' },
        { question: 'diverse', japanese: '多様な' },
        { question: 'enhance', japanese: '高める' },
        // 残りのElementary単語...
    ],
    'toeic600': [
        { question: 'allocate', japanese: '割り当てる' },
        { question: 'compromise', japanese: '妥協' },
        { question: 'diligent', japanese: '勤勉な' },
        { question: 'elaborate', japanese: '精巧な' },
        { question: 'frequent', japanese: '頻繁な' },
        // 残りのPre-Intermediate単語...
    ],
    'toeic700': [
        { question: 'adjacent', japanese: '隣接した' },
        { question: 'commence', japanese: '開始する' },
        { question: 'diminish', japanese: '減少する' },
        { question: 'expedite', japanese: '促進する' },
        { question: 'fluctuate', japanese: '変動する' },
        // 残りのIntermediate単語...
    ],
    'toeic800': [
        { question: 'affirm', japanese: '確認する' },
        { question: 'coherent', japanese: '一貫した' },
        { question: 'discrepancy', japanese: '相違' },
        { question: 'elicit', japanese: '引き出す' },
        { question: 'feasible', japanese: '実行可能な' },
        // 残りのUpper-Intermediate単語...
    ],
    'toeic900': [
        { question: 'acumen', japanese: '洞察力' },
        { question: 'disparate', japanese: '異質の' },
        { question: 'empirical', japanese: '経験的な' },
        { question: 'juxtapose', japanese: '並置する' },
        { question: 'nuance', japanese: '微妙な違い' },
        // 残りのAdvanced単語...
    ]
}