import { GoogleGenAI } from "@google/genai";
import type { FullAnalysisResult, SeoAnalysisResult, WinningSeoPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getJsonPrompt = (keyword: string) => `
Phân tích từ khóa "${keyword}" và thực hiện các bước sau:
1. Xác định ý định tìm kiếm (intent) theo một cấu trúc phân bổ chi tiết.
2. Dùng Google Search để phân tích 3 đối thủ hàng đầu, tóm tắt ĐIỂM MẠNH và ĐIỂM YẾU của họ.
3. Dựa trên phân tích đối thủ, tạo ra một "Kế hoạch SEO Vượt Trội" (Winning SEO Plan) có tính hành động cao.
4. Đưa ra "Bảng phân tích điểm On-page" chi tiết cho kế hoạch đó. QUAN TRỌNG: Điểm số này phải thực tế và dựa trên bối cảnh cạnh tranh. Hãy cân nhắc sức mạnh của đối thủ khi chấm điểm. Nếu đối thủ quá mạnh, một kế hoạch tốt vẫn có thể nhận điểm thấp hơn. Lời giải thích phải phản ánh điều này.
5. Trả về TOÀN BỘ kết quả dưới dạng một chuỗi JSON hợp lệ. TUYỆT ĐỐI KHÔNG thêm bất kỳ văn bản nào khác ngoài chuỗi JSON.

Cấu trúc JSON BẮT BUỘC phải tuân theo định dạng sau:
{
  "intent": {
    "primary": "LOẠI_INTENT_CÓ_TỶ_LỆ_CAO_NHẤT (ví dụ: INFORMATIONAL)",
    "justification": "GIẢI_THÍCH_NGẮN_GỌN_LÝ_DO_PHÂN_BỔ_INTENT_NHƯ_VẬY.",
    "distribution": {
      "informational": SỐ_NGUYÊN_TỪ_0_ĐẾN_100,
      "navigational": SỐ_NGUYÊN_TỪ_0_ĐẾN_100,
      "commercial": SỐ_NGUYÊN_TỪ_0_ĐẾN_100,
      "transactional": SỐ_NGUYÊN_TỪ_0_ĐẾN_100
    }
  },
  "competitorAnalysis": [
    { "rank": 1, "title": "TIÊU_ĐỀ_ĐỐI_THỦ_1", "url": "URL_ĐỐI_THỦ_1", "strengths": "PHÂN_TÍCH_ĐIỂM_MẠNH", "weaknesses": "PHÂN_TÍCH_ĐIỂM_YẾU" },
    { "rank": 2, "title": "TIÊU_ĐỀ_ĐỐI_THỦ_2", "url": "URL_ĐỐI_THỦ_2", "strengths": "PHÂN_TÍCH_ĐIỂM_MẠNH", "weaknesses": "PHÂN_TÍCH_ĐIỂM_YẾU" },
    { "rank": 3, "title": "TIÊU_ĐỀ_ĐỐI_THỦ_3", "url": "URL_ĐỐI_THỦ_3", "strengths": "PHÂN_TÍCH_ĐIỂM_MẠNH", "weaknesses": "PHÂN_TÍCH_ĐIỂM_YẾU" }
  ],
  "winningSeoPlan": {
    "uniqueAngle": "MỘT_GÓC_NHÌN_ĐỘC_ĐÁO_ĐỂ_BÀI_VIẾT_NỔI_BẬT_SO_VỚI_ĐỐI_THỦ",
    "hookIntroduction": "MỘT_ĐOẠN_MỞ_BÀI_HẤP_DẪN_2_3_CÂU_DỰA_TRÊN_GÓC_NHÌN_ĐỘC_ĐÁO",
    "titleOptions": [
        { "title": "LỰA_CHỌN_TIÊU_ĐỀ_1", "psychology": "GIẢI_THÍCH_KỸ_THUẬT_TÂM_LÝ_SỬ_DỤNG (VÍ_DỤ: TẠO_SỰ_TÒ_MÒ)" },
        { "title": "LỰA_CHỌN_TIÊU_ĐỀ_2", "psychology": "GIẢI_THÍCH_KỸ_THUẬT_TÂM_LÝ_SỬ_DỤNG (VÍ_DỤ: LỢI_ÍCH_TRỰC_TIẾP)" }
    ],
    "metaDescriptionOptions": [
        { "description": "LỰA_CHỌN_MÔ_TẢ_1", "psychology": "GIẢI_THÍCH_KỸ_THUẬT_TÂM_LÝ_SỬ_DỤNG (VÍ_DỤ: KÊU_GỌI_HÀNH_ĐỘNG)" },
        { "description": "LỰA_CHỌN_MÔ_TẢ_2", "psychology": "GIẢI_THÍCH_KỸ_THUẬT_TÂM_LÝ_SỬ_DỤNG (VÍ_DỤ: ĐẶT_CÂU_HỎI)" }
    ],
    "aiFirstOutline": {
      "directAnswer": "CÂU_TRẢ_LỜI_TRỰC_TIẾP_NGẮN_GỌN_CHO_AI_OVERVIEW",
      "mainHeadings": ["HEADING_H2_THỨ_1", "HEADING_H2_THỨ_2", "HEADING_H2_THỨ_3"],
      "faqSection": [
        { "question": "CÂU_HỎI_THƯỜNG_GẶP_1", "answer": "CÂU_TRẢ_LỜI_1" },
        { "question": "CÂU_HỎI_THƯỜNG_GẶP_2", "answer": "CÂU_TRẢ_LỜI_2" }
      ]
    },
    "entities": {
      "CHỦ_ĐỀ_1 (ví dụ: 'Thương hiệu')": ["THỰC_THỂ_1A", "THỰC_THỂ_1B"],
      "CHỦ_ĐỀ_2 (ví dụ: 'Khái niệm')": ["THỰC_THỂ_2A", "THỰC_THỂ_2B"]
    },
    "imageStrategy": {
        "suggestedCount": SỐ_LƯỢNG_HÌNH_ẢNH_ĐỀ_XUẤT (VÍ DỤ: 3),
        "details": [
            { "content": "MÔ_TẢ_NỘI_DUNG_HÌNH_1", "filename": "TEN-FILE-SEO-1.jpg", "altText": "VĂN_BẢN_THAY_THẾ_SEO_CHO_HÌNH_1" },
            { "content": "MÔ_TẢ_NỘI_DUNG_HÌNH_2", "filename": "TEN-FILE-SEO-2.jpg", "altText": "VĂN_BẢN_THAY_THẾ_SEO_CHO_HÌNH_2" }
        ]
    },
    "keywordIntegrationStrategy": {
        "keywordPlacements": ["VỊ_TRÍ_CHIẾN_LƯỢC_1_ĐỂ_ĐẶT_TỪ_KHÓA_CHÍNH", "VỊ_TRÍ_CHIẾN_LƯỢC_2"],
        "internalLinkSuggestions": [
            { "anchorText": "ANCHOR_TEXT_GỢI_Ý_1", "linkToTopic": "MÔ_TẢ_CHỦ_ĐỀ_BÀI_VIẾT_ĐÍCH_1" },
            { "anchorText": "ANCHOR_TEXT_GỢI_Ý_2", "linkToTopic": "MÔ_TẢ_CHỦ_ĐỀ_BÀI_VIẾT_ĐÍCH_2" }
        ]
    },
    "suggestedSchema": "MỘT_TRONG_CÁC_LOẠI: FAQPage, HowTo, Article, Product, None"
  },
  "onPageScore": {
    "totalScore": SỐ_NGUYÊN_TỪ_0_ĐẾN_100,
    "breakdown": {
      "contentQuality": { "score": SỐ_TỪ_0_ĐẾN_25, "justification": "GIẢI_THÍCH_VỀ_CHẤT_LƯỢNG_SO_SÁNH_VỚI_ĐỐI_THỦ" },
      "intentMatching": { "score": SỐ_TỪ_0_ĐẾN_25, "justification": "GIẢI_THÍCH_KHẢ_NĂNG_ĐÁP_ỨNG_INTENT_TỐT_HƠN_ĐỐI_THỦ" },
      "structureAndReadability": { "score": SỐ_TỪ_0_ĐẾN_25, "justification": "GIẢI_THÍCH_VỀ_CẤU_TRÚC_VÀ_TẠI_SAO_NÓ_HIỆU_QUẢ" },
      "uniquenessAndValue": { "score": SỐ_TỪ_0_ĐẾN_25, "justification": "GIẢI_THÍCH_VỀ_SỰ_ĐỘC_ĐÁO, CÓ_TÍNH_ĐẾN_ĐIỂM_YẾU_CỦA_ĐỐI_THỦ" }
    }
  }
}
QUAN TRỌNG: Tổng các giá trị trong intent.distribution phải bằng 100.
`;

export const analyzeKeyword = async (keyword: string): Promise<FullAnalysisResult> => {
    const systemInstruction = "Bạn là 'SEO Copilot', một AI Chiến lược gia Nội dung & Tăng trưởng. Nhiệm vụ của bạn là phân tích từ khóa, nghiên cứu đối thủ qua Google Search, và tạo ra một kế hoạch nội dung toàn diện, vượt trội, không chỉ để xếp hạng mà còn để thu hút và chuyển đổi. Luôn trả lời bằng tiếng Việt và tuân thủ định dạng JSON được yêu cầu một cách nghiêm ngặt.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: getJsonPrompt(keyword),
            config: {
                systemInstruction,
                temperature: 0.6,
                tools: [{ googleSearch: {} }],
            },
        });

        const jsonText = response.text
            .trim()
            .replace(/^```json\s*|```\s*$/g, ''); // Clean up potential markdown code blocks

        const analysis: SeoAnalysisResult = JSON.parse(jsonText);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        // Basic validation
        if (!analysis.intent?.distribution || !analysis.winningSeoPlan?.uniqueAngle || !analysis.competitorAnalysis || !analysis.onPageScore?.breakdown) {
          throw new Error("API response is missing required fields.");
        }
        
        return { analysis, sources };
    } catch (error) {
        console.error("Error calling or parsing Gemini API response:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Không thể phân tích phản hồi JSON từ AI. AI có thể đã trả về định dạng không hợp lệ.");
        }
        throw new Error("Thất bại khi lấy phân tích từ Gemini API.");
    }
};

export const generateArticleFromPlan = async (plan: WinningSeoPlan): Promise<string> => {
    const systemInstruction = "Bạn là một chuyên gia viết nội dung SEO đỉnh cao, với khả năng biến một kế hoạch chi tiết thành một bài viết hấp dẫn, tự nhiên và tối ưu hóa hoàn hảo. Giọng văn của bạn chuyên nghiệp, đáng tin cậy nhưng cũng dễ tiếp cận. Luôn viết bằng tiếng Việt.";

    const prompt = `
Dựa trên **TOÀN BỘ KẾ HOẠCH CHI TIẾT** được cung cấp dưới dạng JSON sau đây, hãy viết một bài viết SEO hoàn chỉnh bằng tiếng Việt.

**YÊU CẦU BẮT BUỘC:**
1.  **Tuân thủ tuyệt đối:** Triển khai MỌI yếu tố trong kế hoạch: sử dụng một trong các lựa chọn tiêu đề làm H1, lồng ghép đoạn mở bài, tuân thủ dàn bài H2, tích hợp các thực thể, câu trả lời trực tiếp và FAQ một cách tự nhiên.
2.  **Văn phong:** Viết một cách tự nhiên, hấp dẫn, chuyên gia nhưng dễ hiểu. Tránh lặp từ và giọng văn robot. Sử dụng các đoạn văn ngắn và vừa phải để tăng tính dễ đọc.
3.  **Định dạng:** Trả về kết quả dưới dạng **Markdown** để có thể dễ dàng định dạng (sử dụng # cho H1, ## cho H2, ### cho H3, **chữ đậm**, *chữ nghiêng*, và các danh sách). KHÔNG trả về bất cứ thứ gì khác ngoài nội dung bài viết dạng Markdown.
4.  **Độ dài:** Bài viết cần có độ dài phù hợp (khoảng 1500-2000 từ) để bao quát chủ đề một cách sâu sắc.

**Đây là kế hoạch của bạn:**
\`\`\`json
${JSON.stringify(plan, null, 2)}
\`\`\`

Bây giờ, hãy bắt đầu viết bài.
`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro", // Use a more powerful model for content generation
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for article generation:", error);
        throw new Error("Thất bại khi tạo bài viết từ Gemini API.");
    }
};