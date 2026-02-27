// app/saved/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SavedSearch {
  id: string;
  query: string;
  filters: {
    industry?: string;
    stage?: string;
  };
  createdAt: Date;
  resultCount: number;
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('vc-saved-searches');
    if (saved) {
      setSearches(JSON.parse(saved));
    } else {
      // Mock data
      const mockSearches: SavedSearch[] = [
        {
          id: '1',
          query: 'AI infrastructure',
          filters: { stage: 'Series A' },
          createdAt: new Date('2024-02-15'),
          resultCount: 12,
        },
        {
          id: '2',
          query: 'climate tech',
          filters: { industry: 'CleanTech' },
          createdAt: new Date('2024-02-10'),
          resultCount: 8,
        },
      ];
      setSearches(mockSearches);
      localStorage.setItem('vc-saved-searches', JSON.stringify(mockSearches));
    }
  }, []);

  const deleteSearch = (id: string) => {
    const updated = searches.filter(s => s.id !== id);
    setSearches(updated);
    localStorage.setItem('vc-saved-searches', JSON.stringify(updated));
  };

  const runSearch = (search: SavedSearch) => {
    // Navigate to companies page with search params
    const params = new URLSearchParams();
    if (search.query) params.set('q', search.query);
    if (search.filters.industry) params.set('industry', search.filters.industry);
    if (search.filters.stage) params.set('stage', search.filters.stage);
    
    window.location.href = `/companies?${params.toString()}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
        <p className="text-gray-600 mt-1">Quickly re-run your most important searches</p>
      </div>

      <div className="space-y-4">
        {searches.map((search) => (
          <div key={search.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{search.query}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {search.filters.industry && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {search.filters.industry}
                        </span>
                      )}
                      {search.filters.stage && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {search.filters.stage}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {search.resultCount} results
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center text-xs text-gray-400">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {new Date(search.createdAt).toLocaleDateString()}
                </div>
                
                <button
                  onClick={() => runSearch(search)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Run search
                </button>
                
                <button
                  onClick={() => deleteSearch(search.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {searches.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No saved searches yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Save searches from the companies page to run them again later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}