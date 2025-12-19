'use client';

interface TimeRangeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) { // value is in days
  const ranges = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
    { label: 'All Time', value: 3650 }, // 10 years implies all time effectively
  ];

  return (
    <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-1 w-fit">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            value === r.value
              ? 'bg-[var(--bg-tertiary)] text-white shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-white'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
