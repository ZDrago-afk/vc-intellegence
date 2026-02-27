// app/lists/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface List {
  id: string;
  name: string;
  description: string;
  companyCount: number;
  createdAt: Date;
}

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  useEffect(() => {
    // Load lists from localStorage
    const savedLists = localStorage.getItem('vc-lists');
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    } else {
      // Mock data
      const mockLists: List[] = [
        {
          id: '1',
          name: 'AI Infrastructure',
          description: 'Companies building AI infrastructure and tooling',
          companyCount: 5,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Enterprise SaaS',
          description: 'Promising enterprise software startups',
          companyCount: 8,
          createdAt: new Date('2024-02-01'),
        },
      ];
      setLists(mockLists);
      localStorage.setItem('vc-lists', JSON.stringify(mockLists));
    }
  }, []);

  const createList = () => {
    if (!newListName.trim()) return;
    
    const newList: List = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      companyCount: 0,
      createdAt: new Date(),
    };
    
    const updatedLists = [newList, ...lists];
    setLists(updatedLists);
    localStorage.setItem('vc-lists', JSON.stringify(updatedLists));
    
    setNewListName('');
    setNewListDescription('');
    setShowNewList(false);
  };

  const deleteList = (id: string) => {
    const updatedLists = lists.filter(l => l.id !== id);
    setLists(updatedLists);
    localStorage.setItem('vc-lists', JSON.stringify(updatedLists));
  };

  const exportList = (list: List) => {
    // In a real app, fetch companies in this list and export
    const data = {
      listName: list.name,
      description: list.description,
      exportedAt: new Date().toISOString(),
      companies: [], // Would fetch actual companies
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lists</h1>
          <p className="text-gray-600 mt-1">Organize companies into custom lists</p>
        </div>
        
        <button
          onClick={() => setShowNewList(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          New List
        </button>
      </div>

      {/* New list form */}
      {showNewList && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create new list</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                List name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="input"
                placeholder="e.g., AI Infrastructure"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                className="input"
                rows={2}
                placeholder="What's this list about?"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createList} className="btn-primary">
                Create
              </button>
              <button
                onClick={() => setShowNewList(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <div key={list.id} className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportList(list)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Export list"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete list"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{list.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {list.companyCount} companies
                </span>
                <Link
                  href={`/lists/${list.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View list →
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Created {new Date(list.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lists.length === 0 && !showNewList && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No lists yet</p>
          <button onClick={() => setShowNewList(true)} className="btn-primary">
            Create your first list
          </button>
        </div>
      )}
    </div>
  );
}