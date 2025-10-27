import React from 'react';
import type { SeoAnalysisResult, GroundingChunk, OnPageScoreBreakdown } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { ResultCard } from './ResultCard';

interface ResultsDisplayProps {
    result: SeoAnalysisResult;
    sources: GroundingChunk[];
    onCopy: () => void;
    copyButtonText: string;
    onGenerateArticle: () => void;
    isGeneratingArticle: boolean;
}

const intentMap: Record<string, string> = {
    INFORMATIONAL: 'Thông tin',
    NAVIGATIONAL: 'Điều hướng',
    COMMERCIAL: 'Thương mại',
    TRANSACTIONAL: 'Giao dịch'
};

const CopyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

// --- Icons for Strategic Elements ---
const LightbulbIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.125a6.01 6.01 0 0 0 1.5-1.125v-2.25a6.01 6.01 0 0 0-1.5-1.125a6.01 6.01 0 0 0-1.5-1.125m-1.5 6.375v-5.25m0 0a6.01 6.01 0 0 1-1.5-1.125a6.01 6.01 0 0 1-1.5-1.125v-2.25a6.01 6.01 0 0 1 1.5-1.125a6.01 6.01 0 0 1 1.5-1.125M12 3v-2.25m0 0a1.5 1.5 0 0 1 1.5 1.5v2.25m-3 0a1.5 1.5 0 0 1 1.5-1.5v-2.25m0 0a1.5 1.5 0 0 0-1.5 1.5v2.25" /></svg>;
const PhotoIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
const LinkIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>;
const SchemaIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" /></svg>;

const scoreCriteriaMap: { [key in keyof OnPageScoreBreakdown['breakdown']]: string } = {
    contentQuality: "Chất lượng & Chiều sâu",
    intentMatching: "Đáp ứng Intent",
    structureAndReadability: "Cấu trúc & Dễ đọc",
    uniquenessAndValue: "Độc đáo & Giá trị",
};

const ScoreBreakdownBar: React.FC<{ score: number, maxScore: number }> = ({ score, maxScore }) => {
    const percentage = (score / maxScore) * 100;
    const getColor = (value: number) => {
        if (value >= 80) return 'bg-green-500';
        if (value >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div
                className={`${getColor(percentage)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, sources, onCopy, copyButtonText, onGenerateArticle, isGeneratingArticle }) => {
    const { intent, winningSeoPlan, onPageScore, competitorAnalysis } = result;
    const { aiFirstOutline, imageStrategy, keywordIntegrationStrategy } = winningSeoPlan;
    
    const orderedIntents = React.useMemo(() => {
        return (Object.keys(intent.distribution) as Array<keyof typeof intent.distribution>).sort((a, b) => intent.distribution[b] - intent.distribution[a]);
    }, [intent.distribution]);


    return (
        <div className="mt-8 sm:mt-12 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-200">Kết quả Phân Tích</h2>
                <button 
                    onClick={onCopy}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-cyan-400 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                    {copyButtonText === 'Copy toàn bộ' ? <CopyIcon className="w-5 h-5"/> : <CheckIcon className="w-5 h-5 text-green-400" />}
                    {copyButtonText}
                </button>
            </div>
            
            {/* --- Grid Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column: Scores & Intent --- */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <ResultCard title="🎯 AI Intent Detector">
                         <div className="flex flex-col text-center">
                            <p className="text-gray-400 text-sm">Intent chính</p>
                            <p className="text-2xl font-bold text-cyan-300 mt-1">{intentMap[intent.primary] || intent.primary}</p>
                            <div className="space-y-3 mt-4">
                                {orderedIntents.map(key => (
                                    <div key={key}>
                                        <div className="flex justify-between items-center mb-1 text-sm">
                                            <span className="font-semibold text-gray-300">{intentMap[key.toUpperCase() as keyof typeof intentMap] || key}</span>
                                            <span className="font-bold text-cyan-300">{intent.distribution[key]}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${intent.distribution[key]}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-4 italic bg-gray-900/50 p-2 rounded-md">{intent.justification}</p>
                        </div>
                    </ResultCard>
                     <ResultCard title="📊 Bảng phân tích On-page">
                        <div className="flex flex-col items-center text-center mb-4">
                            <ScoreGauge score={onPageScore.totalScore} />
                            <p className="text-2xl font-bold text-cyan-300 mt-4">{onPageScore.totalScore}/100</p>
                             <p className="text-gray-400">Tổng điểm tiềm năng</p>
                        </div>
                        <div className="space-y-4">
                            {(Object.keys(onPageScore.breakdown) as Array<keyof typeof onPageScore.breakdown>).map((key) => {
                                const value = onPageScore.breakdown[key];
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-semibold text-gray-300">{scoreCriteriaMap[key]}</p>
                                            <p className="text-sm font-bold text-cyan-300">{value.score}/25</p>
                                        </div>
                                        <ScoreBreakdownBar score={value.score} maxScore={25} />
                                        <p className="text-xs text-gray-400 mt-1 italic">{value.justification}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </ResultCard>
                </div>
                
                {/* --- Right Column: Main Analysis --- */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Competitor Analysis */}
                    <ResultCard title="⚔️ Phân tích Đối thủ (Top 3 SERP)">
                        <div className="space-y-4">
                            {competitorAnalysis.map((c) => (
                                <div key={c.rank} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-gray-900 font-bold text-sm rounded-full flex items-center justify-center">{c.rank}</span>
                                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-200 hover:text-cyan-400 transition-colors truncate" title={c.title}>
                                            {c.title}
                                        </a>
                                    </div>
                                    <p className="text-sm text-green-400"><strong className="text-gray-400">Điểm mạnh:</strong> {c.strengths}</p>
                                    <p className="text-sm text-red-400"><strong className="text-gray-400">Điểm yếu:</strong> {c.weaknesses}</p>
                                </div>
                            ))}
                        </div>
                        {sources && sources.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                 <h4 className="font-semibold text-xs text-gray-500 uppercase mb-2">Nguồn tham khảo của AI</h4>
                                 <div className="flex flex-wrap gap-2">
                                     {sources.map((source, index) => source.web && (
                                         <a key={index} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded hover:bg-gray-600 hover:text-cyan-400 transition-colors truncate max-w-[200px]">
                                             {source.web.title || new URL(source.web.uri).hostname}
                                         </a>
                                     ))}
                                 </div>
                            </div>
                        )}
                    </ResultCard>

                    {/* Winning SEO Plan */}
                    <ResultCard title="🏆 Kế hoạch SEO Vượt Trội (Winning SEO Plan)">
                        <div className="space-y-6">
                            <button
                                onClick={onGenerateArticle}
                                disabled={isGeneratingArticle}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-lg flex items-center justify-center gap-2"
                            >
                                🚀 {isGeneratingArticle ? 'AI đang viết bài...' : 'Viết bài SEO hoàn chỉnh'}
                            </button>
                             <div>
                                <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2"><LightbulbIcon className="w-5 h-5"/> Góc nhìn Độc đáo</h4>
                                <p className="bg-gray-900 p-3 rounded-md text-gray-300 border-l-4 border-cyan-400 ">{winningSeoPlan.uniqueAngle}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-300 mb-1">Đoạn mở bài (Hook Introduction)</h4>
                                <p className="bg-gray-900 p-3 rounded-md text-gray-300 italic">{winningSeoPlan.hookIntroduction}</p>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-300">Lựa chọn Tiêu đề & Mô tả (Tối ưu CTR)</h4>
                                {winningSeoPlan.titleOptions.map((opt, index) => (
                                    <details key={`title-${index}`} className="bg-gray-900 p-3 rounded-md">
                                        <summary className="font-semibold text-gray-200 cursor-pointer text-base">{opt.title}</summary>
                                        <p className="text-sm text-cyan-400 mt-2 ml-4 italic">Lý do: {opt.psychology}</p>
                                    </details>
                                ))}
                                {winningSeoPlan.metaDescriptionOptions.map((opt, index) => (
                                     <details key={`meta-${index}`} className="bg-gray-900 p-3 rounded-md">
                                        <summary className="font-medium text-gray-300 cursor-pointer text-sm">{opt.description}</summary>
                                        <p className="text-xs text-cyan-400 mt-2 ml-4 italic">Lý do: {opt.psychology}</p>
                                    </details>
                                ))}
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-300 mb-1">Câu trả lời trực tiếp (For AI Overview)</h4>
                                <p className="bg-gray-900 p-3 rounded-md text-gray-300 border-l-4 border-cyan-400 italic">{aiFirstOutline.directAnswer}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-300 mb-1">Dàn bài chính</h4>
                                <ul className="list-none space-y-2 bg-gray-900 p-3 rounded-md">
                                    {aiFirstOutline.mainHeadings.map((item, index) => (
                                        <li key={index} className="text-gray-300 flex items-start">
                                            <span className="text-cyan-400 mr-2">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-300 mb-1">Phần Hỏi-Đáp (FAQ Section)</h4>
                                <div className="space-y-3 bg-gray-900 p-3 rounded-md">
                                    {aiFirstOutline.faqSection.map((faq, index) => (
                                        <details key={index} className="bg-gray-800/50 p-2 rounded">
                                            <summary className="font-semibold text-gray-200 cursor-pointer">{faq.question}</summary>
                                            <p className="text-gray-400 mt-2 ml-4">{faq.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300 mb-2">Các thực thể cần đề cập (Key Entities)</h4>
                                <div className="space-y-3 bg-gray-900 p-3 rounded-md">
                                    {Object.entries(winningSeoPlan.entities).map(([category, items]) => (
                                        <div key={category}>
                                            <p className="text-sm font-semibold text-gray-400 mb-1">{category}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(items) && items.map((item, index) => (
                                                    <span key={index} className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div className="space-y-3">
                                <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2"><PhotoIcon className="w-5 h-5"/> Chiến lược Hình ảnh (SEO Images)</h4>
                                <div className="bg-gray-900 p-3 rounded-md text-gray-300">
                                  <p className="text-sm font-semibold mb-3">Đề xuất: <span className="font-bold text-cyan-300">{imageStrategy.suggestedCount}</span> hình ảnh</p>
                                  <div className="space-y-3">
                                      {imageStrategy.details.map((img, index) => (
                                          <div key={index} className="border-t border-gray-700 pt-2">
                                              <p className="font-semibold text-gray-300">Hình {index + 1}: <span className="italic font-normal">{img.content}</span></p>
                                              <p className="text-xs text-gray-400 mt-1"><strong className="text-gray-500">Tên file:</strong> <code className="bg-gray-800 px-1 rounded">{img.filename}</code></p>
                                              <p className="text-xs text-gray-400"><strong className="text-gray-500">ALT Text:</strong> <code className="bg-gray-800 px-1 rounded">{img.altText}</code></p>
                                          </div>
                                      ))}
                                  </div>
                                </div>
                             </div>

                             <div className="space-y-3">
                                <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Chiến lược Tích hợp Từ khóa & Liên kết</h4>
                                <div className="bg-gray-900 p-3 rounded-md text-gray-300 space-y-4">
                                  <div>
                                    <h5 className="font-semibold text-sm mb-2">Vị trí đặt từ khóa chính:</h5>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {keywordIntegrationStrategy.keywordPlacements.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-sm mb-2">Gợi ý liên kết nội bộ:</h5>
                                    <div className="space-y-2">
                                      {keywordIntegrationStrategy.internalLinkSuggestions.map((link, index) => (
                                        <div key={index} className="text-sm">
                                          <p><strong>Anchor Text:</strong> <span className="italic text-cyan-300">"{link.anchorText}"</span></p>
                                          <p className="text-xs text-gray-400 pl-4">→ liên kết tới bài viết về chủ đề: "{link.linkToTopic}"</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-cyan-400 mb-1 flex items-center gap-2">
                                    <SchemaIcon className="w-5 h-5" /> Gợi ý Schema
                                </h4>
                                <p className="bg-gray-900 p-3 rounded-md text-gray-300 font-mono">{winningSeoPlan.suggestedSchema}</p>
                            </div>
                        </div>
                    </ResultCard>
                </div>

            </div>
        </div>
    );
};