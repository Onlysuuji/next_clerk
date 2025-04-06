export type LanguageContextType = {
    language: string;
    showLanguage: string;
    setLanguage: (language: string) => void;
    wordPacks: LanguagePack[];
};

export const languageMap: Record<string, string> = {
    english: "英語",
    chinese: "中国語",
    french: "フランス語",
};


export type LanguagePack = {
    id: string;
    tag: string;
    description: string;
    imageUrl: string;
    link: string;
    subpack?: LanguageSubPack[];
}

export type LanguageSubPack = {
    id: string;
    tag: string;
    description: string;
    imageUrl: string;
    link: string;
}

export const wordPack: Record<string, LanguagePack[]> = {
    english: [
        {
            id: 'toeic',
            tag: 'TOEIC',
            description: 'TOEICの目標スコアに合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=TOEIC',
            link: '/english/package/toeic',
            subpack: [
                {
                    id: 'toeic500',
                    tag: 'TOEIC500',
                    description: 'TOEIC500の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=TOEIC500',
                    link: '/english/package/toeic/500'
                },
                {
                    id: 'toeic700',
                    tag: 'TOEIC700',
                    description: 'TOEIC700の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=TOEIC700',
                    link: '/english/package/toeic/700'
                },
                {
                    id: 'toeic900',
                    tag: 'TOEIC900',
                    description: 'TOEIC900の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=TOEIC900',
                    link: '/english/package/toeic/900'
                }
            ]
        },
        {
            id: 'eiken',
            tag: '英検',
            description: '英検の級別に合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=Eiken',
            link: '/english/package/eiken',
            subpack: [
                {
                    id: 'eiken1',
                    tag: '英検1級',
                    description: '英検1級の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=Eiken1',
                    link: '/english/package/eiken/1'
                },
                {
                    id: 'eikenjun1',
                    tag: '英検準1級',
                    description: '英検準1級の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=Eiken1',
                    link: '/english/package/eiken/1'
                },
                {
                    id: 'eiken2',
                    tag: '英検2級',
                    description: '英検2級の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=Eiken2',
                    link: '/english/package/eiken/2'
                },
                {
                    id: 'eikenjun2',
                    tag: '英検準2級',
                    description: '英検準2級の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=Eiken2',
                    link: '/english/package/eiken/2'
                },
            ]
        },
    ],
    chinese: [
        {
            id: 'hsk',
            tag: 'HSK',
            description: 'HSKの級別に合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=HSK',
            link: '/chinese/package/hsk',
            subpack: [
                {
                    id: 'hsk4',
                    tag: 'HSK4',
                    description: 'HSK4の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=HSK4',
                    link: '/chinese/package/hsk/4'
                },
                {
                    id: 'hsk5',
                    tag: 'HSK5',
                    description: 'HSK5の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=HSK5',
                    link: '/chinese/package/hsk/5'
                },
                {
                    id: 'hsk6',
                    tag: 'HSK6',
                    description: 'HSK6の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=HSK6',
                    link: '/chinese/package/hsk/6'
                },
            ]
        },
    ],
    french: [
        {
            id: 'DELF',
            tag: 'フランス語',
            description: 'フランス語の目標スコアに合わせた単語パック',
            imageUrl: 'https://placehold.co/400x200?text=French',
            link: '/french/package/fr',
            subpack: [
                {
                    id: 'A1',
                    tag: 'A1',
                    description: 'A1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/A1'
                },
                {
                    id: 'A2',
                    tag: 'A2',
                    description: 'A2の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/A2'
                },
                {
                    id: 'B1',
                    tag: 'B1',
                    description: 'B1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/B1'
                },
                {
                    id: 'B2',
                    tag: 'B2',
                    description: 'B2の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/B2'
                },
                {
                    id: 'C1',
                    tag: 'C1',
                    description: 'C1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/C1'
                },
                {
                    id: 'C1',
                    tag: 'C1',
                    description: 'C1の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/C1'
                },
                {
                    id: 'C2',
                    tag: 'C2',
                    description: 'C2の目標スコアに合わせた単語パック',
                    imageUrl: 'https://placehold.co/400x200?text=French',
                    link: '/french/package/fr/C2'
                },
            ]
        },
    ],
};