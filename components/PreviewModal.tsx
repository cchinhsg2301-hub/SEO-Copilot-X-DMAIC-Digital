
import React, { useEffect } from 'react';

interface PreviewModalProps {
    markdownContent: string;
    onClose: () => void;
}

const MarkdownRenderer: React.FC<{ markdown: string }> = ({ markdown }) => {
    const renderMarkdown = () => {
        const lines = markdown.split('\n');
        // FIX: Use React.JSX.Element instead of JSX.Element to fix "Cannot find namespace 'JSX'" error.
        const elements: React.JSX.Element[] = [];
        // FIX: Use React.JSX.Element instead of JSX.Element to fix "Cannot find namespace 'JSX'" error.
        let listItems: React.JSX.Element[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4">{listItems}</ul>);
                listItems = [];
            }
        };
        
        const parseInline = (text: string) => {
            return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                }
                return part;
            });
        };

        lines.forEach((line, index) => {
            if (line.startsWith('### ')) {
                flushList();
                elements.push(<h3 key={index} className="text-xl font-bold mt-6 mb-2">{parseInline(line.substring(4))}</h3>);
            } else if (line.startsWith('## ')) {
                flushList();
                elements.push(<h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b border-gray-600 pb-2">{parseInline(line.substring(3))}</h2>);
            } else if (line.startsWith('# ')) {
                flushList();
                elements.push(<h1 key={index} className="text-4xl font-extrabold mt-4 mb-6">{parseInline(line.substring(2))}</h1>);
            } else if (line.startsWith('* ') || line.startsWith('- ')) {
                listItems.push(<li key={index}>{parseInline(line.substring(2))}</li>);
            } else if (line.trim() !== '') {
                flushList();
                elements.push(<p key={index} className="my-4 leading-relaxed">{parseInline(line)}</p>);
            } else {
                flushList(); // Handle paragraphs separated by empty lines
            }
        });

        flushList();
        return elements;
    };

    return <>{renderMarkdown()}</>;
};

export const PreviewModal: React.FC<PreviewModalProps> = ({ markdownContent, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in-fast"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-200">Bản xem trước bài viết</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                        aria-label="Close preview"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <main className="p-6 sm:p-8 overflow-y-auto">
                    <div className="prose prose-invert max-w-none prose-headings:text-cyan-400 prose-strong:text-white prose-p:text-gray-300 prose-li:text-gray-300">
                         <MarkdownRenderer markdown={markdownContent} />
                    </div>
                </main>
            </div>
        </div>
    );
};
