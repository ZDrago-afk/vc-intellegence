// types/index.ts
export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  founded: number;
  location: string;
  website: string;
  employees: number;
  totalFunding: number;
  lastFundingDate: string;
  signals?: string[];
}

export interface EnrichmentResult {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
  sources: {
    url: string;
    fetchedAt: string;
  }[];
}

export interface List {
  id: string;
  name: string;
  description: string;
  companyIds: string[];
  createdAt: Date;
}