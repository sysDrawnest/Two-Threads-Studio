import React, { useState } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
}

function DataTable<T extends { id: string }>({ data, columns, searchPlaceholder = 'Search...', pageSize = 8 }: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = data.filter(item =>
    Object.values(item as Record<string, unknown>).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '');
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-xs pl-9 pr-4 py-2.5 border border-outline-variant focus:border-primary-container focus:outline-none bg-background font-sans text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-outline-variant">
        <table className="w-full min-w-[600px]">
          <thead className="bg-surface-container">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(String(col.key), col.sortable)}
                  className={`text-left px-4 py-3 font-sans text-xs uppercase tracking-widest text-primary-container border-b border-outline-variant ${col.sortable ? 'cursor-pointer hover:bg-surface-container-high select-none' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      <span className="text-on-secondary-container">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 font-sans text-sm text-on-surface-variant italic">No results found.</td>
              </tr>
            ) : paged.map((item, i) => (
              <tr key={item.id} className={`border-b border-outline-variant hover:bg-surface-container/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface-container/20'}`}>
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3 font-sans text-sm text-on-surface-variant">
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[String(col.key)] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-sans text-on-surface-variant">
        <span>Showing {Math.min((page - 1) * pageSize + 1, sorted.length)}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}</span>
        <div className="flex gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-outline-variant bg-background disabled:opacity-40 cursor-pointer hover:bg-surface-container transition-colors">← Prev</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = totalPages <= 5 ? i + 1 : Math.min(Math.max(page - 2 + i, 1), totalPages - 4 + i);
            return (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 border border-outline-variant cursor-pointer transition-colors ${page === p ? 'bg-primary-container text-inverse-on-surface' : 'bg-background hover:bg-surface-container'}`}>{p}</button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-outline-variant bg-background disabled:opacity-40 cursor-pointer hover:bg-surface-container transition-colors">Next →</button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
