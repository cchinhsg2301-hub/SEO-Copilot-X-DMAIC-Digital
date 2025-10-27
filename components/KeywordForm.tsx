
import React from 'react';

interface KeywordFormProps {
    keyword: string;
    setKeyword: (keyword: string) => void;
    onAnalyze: (keyword: string) => void;
    isLoading: boolean;
}

const exampleKeywords = [
    "cách làm bánh tiramisu",
    "đánh giá iPhone 16 Pro",
    "du lịch sapa mùa đông"
];

export const KeywordForm: React.FC<KeywordFormProps> = ({ keyword, setKeyword, onAnalyze, isLoading }) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(keyword);
    };

    const handleExampleClick = (example: string) => {
        setKeyword(example);
        onAnalyze(example);
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full p-2 shadow-lg focus-within:ring-2 focus-within:ring-cyan-500 transition-all duration-300">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Nhập từ khóa của bạn..."
                        className="w-full px-5 py-3 text-lg bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang phân tích...' : 'Phân Tích'}
                    </button>
                </div>
            </form>
             <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-sm text-gray-500 mr-2">Thử ví dụ:</span>
                {exampleKeywords.map((ex) => (
                    <button 
                        key={ex} 
                        onClick={() => handleExampleClick(ex)}
                        disabled={isLoading}
                        className="text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
    );
};
