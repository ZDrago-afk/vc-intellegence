// app/companies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CompaniesTable from '@/components/CompaniesTable';
import { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  {
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
  },
  {
    id: '2',
    name: 'Rippling',
    description: 'Employee management platform unifying payroll, benefits, and IT',
    industry: 'HR Tech',
    stage: 'Series F',
    founded: 2016,
    location: 'San Francisco, CA',
    website: 'https://rippling.com',
    employees: 2000,
    totalFunding: 1200000000,
    lastFundingDate: '2023-11-01',
    signals: ['rapid_growth', 'enterprise_clients', 'changelog_active'],
  },
  {
    id: '3',
    name: 'Vercel',
    description: 'Frontend cloud platform for developers to build and deploy web applications',
    industry: 'Developer Tools',
    stage: 'Series D',
    founded: 2015,
    location: 'San Francisco, CA',
    website: 'https://vercel.com',
    employees: 500,
    totalFunding: 313000000,
    lastFundingDate: '2023-12-05',
    signals: ['open_source', 'viral_product', 'hiring_surge'],
  },
  {
    id: '4',
    name: 'Glean',
    description: 'AI-powered enterprise search and knowledge discovery platform',
    industry: 'Enterprise Software',
    stage: 'Series D',
    founded: 2019,
    location: 'Palo Alto, CA',
    website: 'https://glean.com',
    employees: 400,
    totalFunding: 355000000,
    lastFundingDate: '2023-09-12',
    signals: ['ai_forward', 'fortune_500_clients', 'rapid_growth'],
  },
  {
    id: '5',
    name: 'Deel',
    description: 'Global payroll and compliance platform for remote teams',
    industry: 'HR Tech',
    stage: 'Series D',
    founded: 2019,
    location: 'San Francisco, CA',
    website: 'https://deel.com',
    employees: 2500,
    totalFunding: 630000000,
    lastFundingDate: '2023-10-24',
    signals: ['global_scale', 'hypergrowth', 'product_expansion'],
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Company>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique industries for filter
  const industries = ['all', ...new Set(companies.map(c => c.industry))];
  const stages = ['all', ...new Set(companies.map(c => c.stage))];

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.description.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    const matchesStage = stageFilter === 'all' || company.stage === stageFilter;
    return matchesSearch && matchesIndustry && matchesStage;
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Company) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <p className="text-gray-600 mt-1">Discover and track high-signal companies</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies by name or description..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <select
            className="input w-48"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>
                {industry === 'all' ? 'All Industries' : industry}
              </option>
            ))}
          </select>
          
          <select
            className="input w-48"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            {stages.map(stage => (
              <option key={stage} value={stage}>
                {stage === 'all' ? 'All Stages' : stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedCompanies.length} of {filteredCompanies.length} companies
      </div>

      {/* Companies Table */}
      <CompaniesTable
        companies={paginatedCompanies}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn-secondary"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}