// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BuildingOfficeIcon, 
  ListBulletIcon, 
  BookmarkIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
  { name: 'Lists', href: '/lists', icon: ListBulletIcon },
  { name: 'Saved Searches', href: '/saved', icon: BookmarkIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">VC Scout</h1>
        <p className="text-sm text-gray-500 mt-1">Precision intelligence</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">VC</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Atomico</p>
            <p className="text-xs text-gray-500">Enterprise plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}