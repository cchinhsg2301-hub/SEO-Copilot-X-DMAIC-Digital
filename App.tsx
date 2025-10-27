
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { KeywordForm } from './components/KeywordForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeKeyword, generateArticleFromPlan } from './services/geminiService';
import type { FullAnalysisResult, WinningSeoPlan } from './types';
import { PreviewModal } from './components/PreviewModal';


const EyeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


const App: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<FullAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy toàn bộ');
  
  // State for Article Generation
  const [generatedArticle, setGeneratedArticle] = useState<string | null>(null);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [articleCopyButtonText, setArticleCopyButtonText] = useState<string>('Copy');
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);


  const handleAnalyze = useCallback(async (keywordToAnalyze: string) => {
    if (!keywordToAnalyze.trim()) {
      setError('Vui lòng nhập một từ khóa.');
      return;
    }
    setKeyword(keywordToAnalyze);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setGeneratedArticle(null);
    setArticleError(null);

    try {
      const result = await analyzeKeyword(keywordToAnalyze);
      setAnalysisResult(result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi phân tích. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGenerateArticle = useCallback(async () => {
    if (!analysisResult?.analysis?.winningSeoPlan) {
        setArticleError("Không có kế hoạch SEO để tạo bài viết.");
        return;
    }
    
    setIsGeneratingArticle(true);
    setArticleError(null);
    setGeneratedArticle(null);

    try {
        const article = await generateArticleFromPlan(analysisResult.analysis.winningSeoPlan);
        setGeneratedArticle(article);
        setTimeout(() => {
            articleRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } catch (err) {
        console.error(err);
        setArticleError("Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại.");
    } finally {
        setIsGeneratingArticle(false);
    }
  }, [analysisResult]);


  const formatResultsForCopy = (result: FullAnalysisResult | null): string => {
    if (!result || !result.analysis) return '';

    const { analysis } = result;
    const { intent, winningSeoPlan, onPageScore, competitorAnalysis } = analysis;
    
    // FIX: Correctly access intent properties. `intent.type` should be `intent.primary`,
    // and `intent.confidence` is derived from the distribution value corresponding to the primary intent.
    const intentText = `🎯 **AI Intent Detector**\n- Loại Intent: ${intent.primary}\n- Độ tin cậy: ${intent.distribution[intent.primary.toLowerCase() as keyof typeof intent.distribution]}%`;
    
    const scoreBreakdown = onPageScore.breakdown;
    const scoreText = `📊 **Bảng phân tích điểm On-page (Tổng: ${onPageScore.totalScore}/100)**\n` +
      `- Chất lượng & Chiều sâu: ${scoreBreakdown.contentQuality.score}/25 (${scoreBreakdown.contentQuality.justification})\n` +
      `- Đáp ứng Intent: ${scoreBreakdown.intentMatching.score}/25 (${scoreBreakdown.intentMatching.justification})\n` +
      `- Cấu trúc & Dễ đọc: ${scoreBreakdown.structureAndReadability.score}/25 (${scoreBreakdown.structureAndReadability.justification})\n` +
      `- Độc đáo & Giá trị: ${scoreBreakdown.uniquenessAndValue.score}/25 (${scoreBreakdown.uniquenessAndValue.justification})`;

    const competitorsText = `⚔️ **Phân tích Đối thủ**\n\n` +
      competitorAnalysis.map(c => 
        `**Rank ${c.rank}: ${c.title}**\n` +
        `- URL: ${c.url}\n` +
        `- Điểm mạnh: ${c.strengths}\n` +
        `- Điểm yếu: ${c.weaknesses}`
      ).join('\n\n');

    const imageStrategyText = `**- Chiến lược Hình ảnh (SEO Images) (Đề xuất: ${winningSeoPlan.imageStrategy.suggestedCount} hình ảnh):**\n` +
      winningSeoPlan.imageStrategy.details.map((img, i) => 
        `  - Hình ${i+1}:\n` +
        `    - Nội dung: ${img.content}\n` +
        `    - Tên file: ${img.filename}\n` +
        `    - ALT Text: ${img.altText}`
      ).join('\n');

    const keywordIntegrationText = `**- Chiến lược Tích hợp Từ khóa & Liên kết:**\n` +
      `  - Vị trí đặt từ khóa chính:\n${winningSeoPlan.keywordIntegrationStrategy.keywordPlacements.map(p => `    - ${p}`).join('\n')}\n` +
      `  - Gợi ý liên kết nội bộ:\n${winningSeoPlan.keywordIntegrationStrategy.internalLinkSuggestions.map(l => `    - Anchor text "${l.anchorText}" liên kết tới bài về "${l.linkToTopic}"`).join('\n')}`;

    const planText = `🏆 **Kế hoạch SEO Vượt Trội (Winning SEO Plan)**\n\n` +
      `**- Góc nhìn Độc đáo:**\n${winningSeoPlan.uniqueAngle}\n\n` +
      `**- Đoạn mở bài (Hook Introduction):**\n${winningSeoPlan.hookIntroduction}\n\n` +
      `**- Lựa chọn Tiêu đề (Title):**\n${winningSeoPlan.titleOptions.map(opt => `- ${opt.title} (Lý do: ${opt.psychology})`).join('\n')}\n\n` +
      `**- Lựa chọn Mô tả (Meta Description):**\n${winningSeoPlan.metaDescriptionOptions.map(opt => `- ${opt.description} (Lý do: ${opt.psychology})`).join('\n')}\n\n` +
      `**- Gợi ý Schema:** ${winningSeoPlan.suggestedSchema}\n\n` +
      `**- Câu trả lời trực tiếp (For AI Overview):**\n${winningSeoPlan.aiFirstOutline.directAnswer}\n\n` +
      `**- Dàn bài chính:**\n${winningSeoPlan.aiFirstOutline.mainHeadings.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n` +
      `**- Phần Hỏi-Đáp (FAQ Section):**\n${winningSeoPlan.aiFirstOutline.faqSection.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}\n\n` +
      `**- Các thực thể cần đề cập (Key Entities):**\n${Object.entries(winningSeoPlan.entities).map(([category, items]) => ` - ${category}: ${Array.isArray(items) ? items.join(', ') : ''}`).join('\n')}\n\n` +
      `${imageStrategyText}\n\n` +
      `${keywordIntegrationText}`;

    return `${intentText}\n\n${scoreText}\n\n${competitorsText}\n\n${planText}`;
  };

  const handleCopy = useCallback(() => {
    if (analysisResult) {
      const textToCopy = formatResultsForCopy(analysisResult);
      navigator.clipboard.writeText(textToCopy);
      setCopyButtonText('Đã sao chép ✓');
      setTimeout(() => {
        setCopyButtonText('Copy toàn bộ');
      }, 2000);
    }
  }, [analysisResult]);

  const handleCopyArticle = useCallback(() => {
    if (generatedArticle) {
        navigator.clipboard.writeText(generatedArticle);
        setArticleCopyButtonText('Đã sao chép ✓');
        setTimeout(() => {
            setArticleCopyButtonText('Copy');
        }, 2000);
    }
  }, [generatedArticle]);

  const markdownToHtml = (markdown: string): string => {
    const lines = markdown.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        // Simple trim for processing
        const trimmedLine = line.trim();

        const processInlineFormatting = (text: string) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
        };

        if (trimmedLine.startsWith('### ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h3>${processInlineFormatting(trimmedLine.substring(4))}</h3>`;
        } else if (trimmedLine.startsWith('## ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h2>${processInlineFormatting(trimmedLine.substring(3))}</h2>`;
        } else if (trimmedLine.startsWith('# ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h1>${processInlineFormatting(trimmedLine.substring(2))}</h1>`;
        } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${processInlineFormatting(trimmedLine.substring(2))}</li>`;
        } else if (trimmedLine === '') {
            if (inList) { html += '</ul>'; inList = false; }
        } else {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<p>${processInlineFormatting(line)}</p>`;
        }
    });

    if (inList) { html += '</ul>'; }

    return html;
  };

  const handleDownloadDocx = useCallback(() => {
      if (!generatedArticle) return;

      const htmlContent = markdownToHtml(generatedArticle);
      
      const styles = `
          <style>
              body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
              h1 { font-size: 24pt; font-weight: bold; color: #2E74B5; margin-top: 24pt; }
              h2 { font-size: 18pt; font-weight: bold; color: #2E74B5; margin-top: 18pt; }
              h3 { font-size: 14pt; font-weight: bold; color: #44546A; margin-top: 14pt; }
              p { margin-bottom: 12pt; line-height: 1.5; }
              ul { margin-left: 40px; }
              li { margin-bottom: 6pt; }
              strong { font-weight: bold; }
              em { font-style: italic; }
          </style>
      `;

      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
              <meta charset='utf-8'>
              <title>SEO Copilot Article</title>
              ${styles}
          </head>
          <body>`;
      const footer = "</body></html>";
      const sourceHTML = header + htmlContent + footer;

      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      
      const safeFilename = keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'seo-article';
      fileDownload.download = `${safeFilename}.doc`;
      
      fileDownload.click();
      document.body.removeChild(fileDownload);
  }, [generatedArticle, keyword]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8">
          <KeywordForm
            keyword={keyword}
            setKeyword={setKeyword}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}
          
          <div ref={resultsRef}>
            {isLoading && <LoadingSpinner loadingState="analysis" />}
            {analysisResult && analysisResult.analysis && !isLoading && (
              <ResultsDisplay 
                result={analysisResult.analysis} 
                sources={analysisResult.sources}
                onCopy={handleCopy}
                copyButtonText={copyButtonText}
                onGenerateArticle={handleGenerateArticle}
                isGeneratingArticle={isGeneratingArticle}
              />
            )}
          </div>
          <div ref={articleRef}>
             {(isGeneratingArticle || generatedArticle || articleError) && (
                 <div className="mt-8">
                     {isGeneratingArticle && <LoadingSpinner loadingState="writing" />}
                     {articleError && (
                         <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                             <p>{articleError}</p>
                         </div>
                     )}
                     {generatedArticle && !isGeneratingArticle && (
                         <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-200">📄 Bài viết SEO Hoàn chỉnh</h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => setIsPreviewing(true)}
                                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-cyan-400 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                        title="Xem trước bài viết"
                                    >
                                        <EyeIcon className="w-5 h-5"/>
                                        <span className="hidden sm:inline">Xem trước</span>
                                    </button>
                                     <button
                                        onClick={handleDownloadDocx}
                                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-cyan-400 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                        title="Tải xuống dưới dạng .DOCX"
                                    >
                                        <DownloadIcon className="w-5 h-5"/>
                                        <span className="hidden sm:inline">Tải DOCX</span>
                                    </button>
                                    <button
                                        onClick={handleCopyArticle}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                    >
                                        {articleCopyButtonText}
                                    </button>
                                </div>
                             </div>
                             <div className="prose prose-invert max-w-none bg-gray-900 p-4 rounded-lg prose-headings:text-cyan-400 prose-strong:text-white max-h-96 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{generatedArticle}</pre>
                             </div>
                         </div>
                     )}
                 </div>
             )}
          </div>
        </main>
      </div>
       {isPreviewing && generatedArticle && (
          <PreviewModal 
            markdownContent={generatedArticle} 
            onClose={() => setIsPreviewing(false)} 
          />
       )}
      <footer className="w-full max-w-6xl mx-auto text-center py-8 mt-12 text-gray-500 text-sm">
        <p>Powered by Google Gemini API. © 2024 SEO Copilot.</p>
      </footer>
    </div>
  );
};

export default App;
