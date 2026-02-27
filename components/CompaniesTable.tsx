// components/CompaniesTable.tsx
'use client';

import Link from 'next/link';
import { Company } from '@/types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Props {
  companies: Company[];
  sortField: keyof Company;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Company) => void;
}

export default function CompaniesTable({ companies, sortField, sortDirection, onSort }: Props) {
  const formatFunding = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
    return `$${amount}`;
  };

  const SortIcon = ({ field }: { field: keyof Company }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="w-4 h-4 inline ml-1" />
      : <ArrowDownIcon className="w-4 h-4 inline ml-1" />;
  };

  const getSignalColor = (signal: string) => {
    const colors: Record<string, string> = {
      recent_blog_post: 'bg-green-100 text-green-800',
      careers_page: 'bg-blue-100 text-blue-800',
      product_launch: 'bg-purple-100 text-purple-800',
      rapid_growth: 'bg-orange-100 text-orange-800',
      hiring_surge: 'bg-red-100 text-red-800',
      ai_forward: 'bg-indigo-100 text-indigo-800',
    };
    return colors[signal] || 'bg-gray-100 text-gray-800';
  };

  const formatSignal = (signal: string) => {
    return signal.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => onSort('name')}
            >
              Company <SortIcon field="name" />
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => onSort('industry')}
            >
              Industry <SortIcon field="industry" />
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => onSort('stage')}
            >
              Stage <SortIcon field="stage" />
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => onSort('totalFunding')}
            >
              Total Funding <SortIcon field="totalFunding" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Signals
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <Link 
                  href={`/companies/${company.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {company.name}
                </Link>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {company.description}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {company.industry}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {company.stage}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatFunding(company.totalFunding)}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {company.signals?.map((signal) => (
                    <span
                      key={signal}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getSignalColor(signal)}`}
                    >
                      {formatSignal(signal)}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {companies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No companies found</p>
        </div>
      )}
    </div>
  );
}