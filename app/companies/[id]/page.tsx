// app/companies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  SparklesIcon,
  BookmarkIcon as BookmarkOutline,
  BookmarkIcon as BookmarkSolid,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { Company, EnrichmentResult } from '@/types';
import EnrichmentPanel from '@/components/EnrichmentPanel';
import NotesSection from '@/components/NotesSection';

const MOCK_COMPANY: Company = {
  id: '1',
  name: 'Anthropic',
  description: 'AI research and safety company building reliable, interpretable AI systems',
  industry: 'Artificial Intelligence',
  stage: 'Series C',
  founded: 2021,
  location: 'San Francisco, CA',
  website: 'https://anthropic.com',
  employees: 300,
  totalFunding: 1750000000,
  lastFundingDate: '2023-05-23',
  signals: ['recent_blog_post', 'careers_page', 'product_launch'],
};

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company>(MOCK_COMPANY);
  const [isSaved, setIsSaved] = useState(false);
  const [enrichment, setEnrichment] = useState<EnrichmentResult | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [notes, setNotes] = useState<Array<{ id: string; content: string; timestamp: Date }>>([]);

  useEffect(() => {
    // In a real app, fetch company by ID
    // For now, we'll just use the mock data
    console.log('Fetching company:', params.id);
  }, [params.id]);

  const handleEnrich = async () => {
    setIsEnriching(true);
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: company.website,
          companyName: company.name 
        }),
      });
      
      if (!response.ok) throw new Error('Enrichment failed');
      
      const data = await response.json();
      setEnrichment(data);
    } catch (error) {
      console.error('Enrichment error:', error);
      // Show error toast
    } finally {
      setIsEnriching(false);
    }
  };

  const formatFunding = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
    return `$${amount}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to companies
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600 mt-1">{company.description}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="btn-secondary flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <BookmarkSolid className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <BookmarkOutline className="w-4 h-4" />
                  Save to list
                </>
              )}
            </button>
            
            <button className="btn-primary">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Company info */}
        <div className="col-span-2 space-y-6">
          {/* Key metrics */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium">{company.industry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stage</p>
                <p className="font-medium">{company.stage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Founded</p>
                <p className="font-medium">{company.founded}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{company.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-medium">{company.employees.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Funding</p>
                <p className="font-medium">{formatFunding(company.totalFunding)}</p>
              </div>
            </div>
          </div>

          {/* Signals timeline */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Signals Timeline</h2>
            <div className="space-y-4">
              {company.signals?.map((signal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                  <div>
                    <p className="font-medium">{signal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="text-sm text-gray-500">Detected 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes section */}
          <NotesSection notes={notes} setNotes={setNotes} />
        </div>

        {/* Right column - Enrichment */}
        <div className="space-y-6">
          {/* Enrichment panel */}
          <EnrichmentPanel
            company={company}
            enrichment={enrichment}
            isEnriching={isEnriching}
            onEnrich={handleEnrich}
          />

          {/* Quick actions */}
          <div className="card p-4">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <GlobeAltIcon className="w-4 h-4" />
                Visit website
              </a>
              <button className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <EnvelopeIcon className="w-4 h-4" />
                Contact founder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}