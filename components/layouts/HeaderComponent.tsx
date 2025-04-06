import React from 'react';
import StudyHeader from '../study/StudyHeader';

export const HeaderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <div className="bg-white">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    {/* ヘッダーセクション */}
                    <StudyHeader />
                    {children}
                </main>
            </div>
        </>
    )
}