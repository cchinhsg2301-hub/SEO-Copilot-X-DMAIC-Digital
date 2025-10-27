import React from 'react';
import { LoadingState } from '../types';

const analysisMessages = [
    "AI đang phân tích đối thủ...",
    "Đang tìm kiếm ý định người dùng...",
    "Xây dựng kế hoạch SEO hoàn hảo...",
    "Sắp xong rồi, chờ một chút nhé!"
];

const writingMessages = [
    "AI đang khởi động bút...",
    "Phác thảo đoạn mở bài hấp dẫn...",
    "Triển khai các luận điểm chính...",
    "Lồng ghép các thực thể một cách tự nhiên...",
    "Thêm vào các câu hỏi FAQ...",
    "Hoàn thiện và chau chuốt câu chữ..."
];

interface LoadingSpinnerProps {
    loadingState: LoadingState;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loadingState }) => {
    const messages = loadingState === 'analysis' ? analysisMessages : writingMessages;
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        setMessage(messages[0]); // Reset message on state change
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2500);
        return () => clearInterval(interval);
    }, [loadingState, messages]);

    return (
        <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-700"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-lg text-gray-300 transition-opacity duration-500">{message}</p>
        </div>
    );
};
