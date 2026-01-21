'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UsernameFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(searchParams.get('username') || '');

  // Debounce username input
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (username) {
        params.set('username', username);
      } else {
        params.delete('username');
      }

      router.push(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const clearFilter = () => {
    setUsername('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
        Filter by Username
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to filter..."
          className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {username && (
          <button
            onClick={clearFilter}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
