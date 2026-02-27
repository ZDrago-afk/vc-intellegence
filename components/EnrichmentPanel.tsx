// components/EnrichmentPanel.tsx
'use client';

import { SparklesIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Company, EnrichmentResult } from '@/types';

interface Props {
  company: Company;
  enrichment: EnrichmentResult | null;
  isEnriching: boolean;
  onEnrich: () => void;
}

export default function EnrichmentPanel({ company, enrichment, isEnriching, onEnrich }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Live Enrichment</h2>
        <button
          onClick={onEnrich}
          disabled={isEnriching}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <SparklesIcon className="w-4 h-4" />
          {isEnriching ? 'Enriching...' : 'Enrich now'}
        </button>
      </div>

      {isEnriching && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Scraping public data...</p>
        </div>
      )}

      {enrichment && !isEnriching && (
        <div className="space-y-4">
          {/* Summary */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {enrichment.summary}
            </p>
          </div>

          {/* What they do */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">What they do</h3>
            <ul className="list-disc list-inside space-y-1">
              {enrichment.whatTheyDo.map((item, i) => (
                <li key={i} className="text-sm text-gray-600">{item}</li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {enrichment.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Derived signals */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Derived Signals</h3>
            <div className="space-y-2">
              {enrichment.derivedSignals.map((signal, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-gray-700">{signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4" />
              Sources
            </h3>
            <div className="space-y-2">
              {enrichment.sources.map((source, i) => (
                <div key={i} className="text-xs">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {source.url}
                  </a>
                  <span className="text-gray-500 ml-2">
                    <ClockIcon className="w-3 h-3 inline mr-1" />
                    {new Date(source.fetchedAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!enrichment && !isEnriching && (
        <div className="text-center py-8 text-gray-500">
          <SparklesIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Click enrich to fetch live data from {company.website}</p>
        </div>
      )}
    </div>
  );
}