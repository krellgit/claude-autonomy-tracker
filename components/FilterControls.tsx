'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import LimitSelector from './LimitSelector';

interface FilterControlsProps {
  defaultSort?: 'duration' | 'sessions' | 'recent';
  defaultOrder?: 'asc' | 'desc';
  defaultLimit?: number;
}

export default function FilterControls({
  defaultSort = 'duration',
  defaultOrder = 'desc',
  defaultLimit = 50
}: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(searchParams.get('username') || '');

  const currentSort = (searchParams.get('user_sort') as 'duration' | 'sessions' | 'recent') || defaultSort;
  const currentOrder = (searchParams.get('user_order') as 'asc' | 'desc') || defaultOrder;

  // Debounce username input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('username', username || undefined);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push('/', { scroll: false });
    setUsername('');
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort Options */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
            Sort By
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('user_sort', 'duration')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentSort === 'duration'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Best Time
            </button>
            <button
              onClick={() => updateFilter('user_sort', 'sessions')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentSort === 'sessions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Most Sessions
            </button>
            <button
              onClick={() => updateFilter('user_sort', 'recent')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentSort === 'recent'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Most Recent
            </button>
          </div>
        </div>

        {/* Order Toggle */}
        <div className="min-w-[120px]">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
            Order
          </label>
          <select
            value={currentOrder}
            onChange={(e) => updateFilter('user_order', e.target.value)}
            className="w-full px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>

        {/* Limit Selector */}
        <div className="min-w-[120px]">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
            Show
          </label>
          <LimitSelector
            paramName="users_limit"
            options={[10, 20, 50, 100]}
            defaultValue={defaultLimit}
            label=""
          />
        </div>
      </div>

      {/* Username Filter */}
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
          Filter by Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to filter..."
          className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
