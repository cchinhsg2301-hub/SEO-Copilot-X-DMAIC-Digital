export enum IntentType {
  INFORMATIONAL = 'INFORMATIONAL',
  NAVIGATIONAL = 'NAVIGATIONAL',
  COMMERCIAL = 'COMMERCIAL',
  TRANSACTIONAL = 'TRANSACTIONAL',
}

export enum SuggestedSchemaType {
    None = 'None',
    FAQPage = 'FAQPage',
    HowTo = 'HowTo',
    Article = 'Article',
    Product = 'Product',
}

export type LoadingState = 'analysis' | 'writing';

export type CategorizedEntities = Record<string, string[]>;

export interface Competitor {
    rank: number;
    title: string;
    url: string;
    strengths: string;
    weaknesses: string;
}

export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    };
}

export interface TitleOption {
    title: string;
    psychology: string;
}

export interface MetaOption {
    description: string;
    psychology: string;
}

export interface ImageDetail {
    content: string;
    filename: string;
    altText: string;
}

export interface ImageStrategy {
    suggestedCount: number;
    details: ImageDetail[];
}

export interface KeywordIntegrationStrategy {
    keywordPlacements: string[];
    internalLinkSuggestions: {
        anchorText: string;
        linkToTopic: string;
    }[];
}

export interface WinningSeoPlan {
    uniqueAngle: string;
    hookIntroduction: string;
    titleOptions: TitleOption[];
    metaDescriptionOptions: MetaOption[];
    aiFirstOutline: {
        directAnswer: string;
        mainHeadings: string[];
        faqSection: {
            question: string;
            answer: string;
        }[];
    };
    entities: CategorizedEntities;
    imageStrategy: ImageStrategy;
    keywordIntegrationStrategy: KeywordIntegrationStrategy;
    suggestedSchema: SuggestedSchemaType;
}

export interface ScoreComponent {
    score: number;
    justification: string;
}

export interface OnPageScoreBreakdown {
    totalScore: number;
    breakdown: {
        contentQuality: ScoreComponent;
        intentMatching: ScoreComponent;
        structureAndReadability: ScoreComponent;
        uniquenessAndValue: ScoreComponent;
    };
}


export interface SeoAnalysisResult {
  intent: {
    primary: IntentType;
    justification: string;
    distribution: {
        informational: number;
        navigational: number;
        commercial: number;
        transactional: number;
    };
  };
  competitorAnalysis: Competitor[];
  winningSeoPlan: WinningSeoPlan;
  onPageScore: OnPageScoreBreakdown;
}

export interface FullAnalysisResult {
    analysis: SeoAnalysisResult;
    sources: GroundingChunk[];
}