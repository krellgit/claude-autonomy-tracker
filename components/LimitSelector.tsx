'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface LimitSelectorProps {
  paramName: string; // URL param name (e.g., 'sessions_limit' or 'users_limit')
  options: number[];
  defaultValue: number;
  label?: string;
}

export default function LimitSelector({
  paramName,
  options,
  defaultValue,
  label = 'Show'
}: LimitSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentValue = parseInt(searchParams.get(paramName) || String(defaultValue));

  const handleChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, value.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 dark:text-gray-400">{label}:</label>
      <select
        value={currentValue}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
