
import React from 'react';

interface ResultCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, children, className }) => {
    return (
        <div className={`bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg p-6 backdrop-blur-sm h-full ${className}`}>
            <h3 className="text-xl font-bold mb-4 text-gray-200">{title}</h3>
            <div>{children}</div>
        </div>
    );
};
