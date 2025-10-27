
import React from 'react';

const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2a10 10 0 0 0-3.53 19.497c.21.034.42.06.63.084l.32.037.33.033c.18.017.36.028.54.033.48.017.96.017 1.44 0 .18-.005.36-.016.54-.033l.33-.033.32-.037a8.55 8.55 0 0 1 .63-.084A10 10 0 0 0 12 2Zm-8.5 9.5a8.5 8.5 0 0 1 14.54-5.32c.16.29.3.59.43.9l.02.04c.12.28.22.56.3.85l.02.08c.07.24.13.48.17.73l.01.07c.04.25.06.5.06.75a8.5 8.5 0 0 1-15.5 2.5Z"/>
        <path d="M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M18 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M6 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M12 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M12 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M9 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M15 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M9 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
        <path d="M15 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="flex justify-center items-center gap-4">
                <BrainCircuitIcon className="w-12 h-12 text-cyan-400" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    SEO Copilot
                </h1>
            </div>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                Tạo kế hoạch SEO tối ưu cho Google AI Overview và các công cụ tìm kiếm thế hệ mới.
            </p>
        </header>
    );
};
