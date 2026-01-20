'use client';

import React from 'react';
import { getThemeById } from '@/utils/pdfThemes';

interface MonthlyIllustrationProps {
    month: number;
    themeId: string;
}

// 테마 ID를 월 번호로 매핑
const THEME_MONTH_MAP: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
};

const MONTH_THEMES = ['january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'];

export default function MonthlyIllustration({ month, themeId }: MonthlyIllustrationProps) {
    // 자동 테마인 경우 해당 월의 테마 사용, 아니면 선택된 테마 사용
    const effectiveThemeId = themeId === 'auto' ? MONTH_THEMES[month - 1] : themeId;
    const theme = getThemeById(effectiveThemeId);

    // 일러스트가 없는 테마면 렌더링하지 않음
    if (!theme.hasIllustration) return null;

    // 테마 ID에서 월 번호 추출
    const displayMonth = THEME_MONTH_MAP[effectiveThemeId] || month;

    const IllustrationContainer = ({ children }: { children: React.ReactNode }) => (
        <div className="mt-8 relative h-48 w-full overflow-hidden rounded-b-lg border-t border-gray-100 bg-white/20">
            {children}
        </div>
    );

    switch (displayMonth) {
        case 1: // January: New Year Sunrise
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-blue-100 to-transparent" />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-400 rounded-full blur-xl opacity-60" />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-300 rounded-full shadow-[0_0_40px_rgba(253,224,71,0.8)]" />
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-white rounded-t-[100%] scale-150 translate-y-4" />
                    <div className="absolute bottom-0 left-[10%] w-0 h-0 border-l-[40px] border-r-[40px] border-b-[80px] border-l-transparent border-r-transparent border-b-blue-200/50" />
                    <div className="absolute bottom-0 right-[10%] w-0 h-0 border-l-[50px] border-r-[50px] border-b-[100px] border-l-transparent border-r-transparent border-b-blue-100/50" />
                </IllustrationContainer>
            );

        case 2: // February: Winter Village
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-white/40 rounded-t-[100%] scale-150 translate-y-10" />
                    <div className="absolute bottom-0 right-0 w-full h-40 bg-white/60 rounded-t-[100%] scale-150 translate-x-1/4 translate-y-10" />
                    <div className="absolute bottom-10 left-[10%] w-0 h-0 border-l-[15px] border-r-[15px] border-b-[40px] border-l-transparent border-r-transparent border-b-[#1e3a8a]/80" />
                    <div className="absolute bottom-10 left-[15%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[50px] border-l-transparent border-r-transparent border-b-[#1e3a8a]" />
                    <div className="absolute bottom-8 right-[20%] w-0 h-0 border-l-[25px] border-r-[25px] border-b-[60px] border-l-transparent border-r-transparent border-b-[#1e3a8a]" />
                    <div className="absolute bottom-10 right-[15%] w-0 h-0 border-l-[15px] border-r-[15px] border-b-[40px] border-l-transparent border-r-transparent border-b-[#1e3a8a]/80" />
                    <div className="absolute bottom-10 left-[40%] w-16 h-12 bg-[#1e3a8a] flex justify-center items-end p-2 gap-2">
                        <div className="w-3 h-4 bg-yellow-200" />
                        <div className="w-3 h-4 bg-yellow-200" />
                        <div className="absolute -top-8 left-[-4px] w-0 h-0 border-l-[36px] border-r-[36px] border-b-[32px] border-l-transparent border-r-transparent border-b-[#ef4444]" />
                    </div>
                    <div className="absolute bottom-12 right-[40%] w-12 h-16 bg-[#1e3a8a] flex flex-col items-center justify-end p-2 gap-2">
                        <div className="w-4 h-4 bg-yellow-200" />
                        <div className="w-4 h-4 bg-yellow-200" />
                        <div className="absolute -top-8 left-[-4px] w-0 h-0 border-l-[28px] border-r-[28px] border-b-[32px] border-l-transparent border-r-transparent border-b-[#1e3a8a]" />
                    </div>
                    <div className="absolute bottom-0 w-full h-10 bg-white" />
                </IllustrationContainer>
            );

        case 3: // March: Spring Sprouts
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-12 bg-green-100" />
                    <div className="absolute bottom-12 left-[20%] w-1 h-16 bg-green-500 rounded-full" />
                    <div className="absolute bottom-[60px] left-[20%] w-8 h-4 bg-green-400 rounded-full -translate-x-full -rotate-12" />
                    <div className="absolute bottom-[40px] left-[20%] w-8 h-4 bg-green-400 rounded-full rotate-12" />

                    <div className="absolute bottom-12 left-[50%] w-1 h-20 bg-green-600 rounded-full" />
                    <div className="absolute bottom-[70px] left-[50%] w-10 h-5 bg-green-500 rounded-full -translate-x-full -rotate-12" />
                    <div className="absolute bottom-[50px] left-[50%] w-10 h-5 bg-green-500 rounded-full rotate-12" />

                    <div className="absolute bottom-12 right-[20%] w-1 h-14 bg-green-500 rounded-full" />
                    <div className="absolute bottom-[50px] right-[20%] w-6 h-3 bg-green-400 rounded-full translate-x-full rotate-12" />

                    <div className="absolute top-10 left-[10%] w-12 h-12 bg-pink-200/40 rounded-full blur-md animate-pulse" />
                    <div className="absolute top-20 right-[15%] w-16 h-16 bg-pink-200/30 rounded-full blur-lg animate-pulse" />
                </IllustrationContainer>
            );

        case 4: // April: Tulips
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-200 to-transparent" />
                    {[20, 35, 50, 65, 80].map((left, i) => (
                        <div key={i} className="absolute bottom-0" style={{ left: `${left}%` }}>
                            <div className="w-1 h-24 bg-green-600 mx-auto" />
                            <div className={`w-8 h-10 rounded-t-full -translate-y-28 mx-auto ${i % 2 === 0 ? 'bg-red-500' : 'bg-yellow-400'}`} />
                            <div className="w-10 h-4 bg-green-500 rounded-full -translate-y-20 -translate-x-4 rotate-45" />
                        </div>
                    ))}
                </IllustrationContainer>
            );

        case 5: // May: Carnations/Family
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-full flex items-center justify-center">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-red-400 rounded-full opacity-20 animate-ping" />
                            <div className="absolute inset-4 bg-red-500 rounded-full shadow-lg flex items-center justify-center">
                                <span className="text-white font-bold text-4xl">♥</span>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-20 bg-green-600" />
                            <div className="absolute bottom-4 left-1/2 w-12 h-6 bg-green-500 rounded-full -rotate-12" />
                        </div>
                    </div>
                </IllustrationContainer>
            );

        case 6: // June: Hydrangea/Rain
            return (
                <IllustrationContainer>
                    <div className="absolute inset-0 bg-blue-50/30" />
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-4 bg-blue-300 rounded-full animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random()}s`
                            }}
                        />
                    ))}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
                        <div className="w-24 h-20 bg-purple-400 rounded-full opacity-80 blur-sm" />
                        <div className="w-20 h-16 bg-blue-400 rounded-full opacity-80 blur-sm translate-y-4" />
                    </div>
                </IllustrationContainer>
            );

        case 7: // July: Summer Sea
            return (
                <IllustrationContainer>
                    <div className="absolute inset-0 bg-cyan-100/50" />
                    <div className="absolute bottom-0 w-full h-24 bg-blue-500 rounded-t-[50%] scale-150 translate-y-10 animate-pulse" />
                    <div className="absolute bottom-0 w-full h-16 bg-cyan-400 rounded-t-[50%] scale-150 translate-y-8 opacity-60" />
                    <div className="absolute top-10 right-[20%] w-16 h-16 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
                    <div className="absolute bottom-10 left-[30%] w-12 h-12 bg-white rounded-full border-4 border-red-400 flex items-center justify-center rotate-12">
                        <div className="w-full h-1 bg-red-400 rotate-45" />
                        <div className="w-full h-1 bg-red-400 -rotate-45" />
                    </div>
                </IllustrationContainer>
            );

        case 8: // August: Sunflower
            return (
                <IllustrationContainer>
                    <div className="absolute inset-0 bg-orange-50/30" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <div className="w-2 h-40 bg-green-700 mx-auto" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400 rounded-full border-8 border-yellow-500 shadow-xl flex items-center justify-center">
                            <div className="w-16 h-16 bg-amber-900 rounded-full grid grid-cols-4 grid-rows-4 gap-1 p-2">
                                {[...Array(16)].map((_, i) => <div key={i} className="w-1 h-1 bg-amber-700 rounded-full" />)}
                            </div>
                        </div>
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-16 left-1/2 w-4 h-16 bg-yellow-300 rounded-full origin-top -translate-x-1/2"
                                style={{ transform: `translateX(-50%) rotate(${i * 30}deg) translateY(40px)` }}
                            />
                        ))}
                    </div>
                </IllustrationContainer>
            );

        case 9: // September: Autumn Moon
            return (
                <IllustrationContainer>
                    <div className="absolute inset-0 bg-indigo-950" />
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        />
                    ))}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-100 rounded-full shadow-[0_0_50px_rgba(254,249,195,0.4)] flex items-center justify-center">
                        <div className="w-16 h-16 bg-yellow-200/50 rounded-full blur-sm" />
                    </div>
                    <div className="absolute bottom-0 w-full h-12 bg-indigo-900/80 blur-md" />
                    <div className="absolute bottom-4 left-[20%] w-1 h-12 bg-pink-400/60 rounded-full" />
                    <div className="absolute bottom-4 right-[30%] w-1 h-16 bg-pink-400/60 rounded-full" />
                </IllustrationContainer>
            );

        case 10: // October: Maple
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-12 bg-orange-100" />
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-6 h-6 rounded-br-full rounded-tl-full animate-pulse ${i % 2 === 0 ? 'bg-red-500' : 'bg-orange-500'}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                bottom: `${Math.random() * 100}%`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                opacity: 0.6 + Math.random() * 0.4
                            }}
                        />
                    ))}
                    <div className="absolute bottom-0 left-[10%] w-2 h-32 bg-amber-900 rounded-full" />
                    <div className="absolute bottom-20 left-[10%] w-24 h-24 bg-red-600 rounded-full blur-xl opacity-40" />
                </IllustrationContainer>
            );

        case 11: // November: Late Autumn
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-16 bg-stone-200/50" />
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bottom-0 w-0.5 bg-stone-400 origin-bottom"
                            style={{
                                left: `${i * 5}%`,
                                height: `${30 + Math.random() * 40}%`,
                                transform: `rotate(${-10 + Math.random() * 20}deg)`
                            }}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-12 bg-stone-300 rounded-full blur-[1px]" />
                        </div>
                    ))}
                    <div className="absolute top-10 right-[10%] w-20 h-8 bg-gray-200 rounded-full blur-md opacity-60" />
                </IllustrationContainer>
            );

        case 12: // December: Christmas
            return (
                <IllustrationContainer>
                    <div className="absolute bottom-0 w-full h-12 bg-white" />
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-green-800" />
                        <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-green-700 -translate-y-8 mx-auto" />
                        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-green-600 -translate-y-14 mx-auto" />
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                    </div>
                </IllustrationContainer>
            );

        default:
            return null;
    }
}
