'use client';

import { useState } from 'react';

interface Ipo {
  name: string;
  status: 'Open' | 'Upcoming' | 'Closed';
  open: string;
  close: string;
  gmp: string;
  gmpVal: number; // numeric for sorting
  size: string;
  sizeVal: number; // numeric for sorting (in Crores)
}

export default function IpoInteractive() {
  const ipos: Ipo[] = [
    { name: 'Swiggy Ltd.', status: 'Upcoming', open: 'TBD', close: 'TBD', gmp: '₹120', gmpVal: 120, size: '₹10,414 Cr', sizeVal: 10414 },
    { name: 'Hyundai Motor India', status: 'Upcoming', open: 'TBD', close: 'TBD', gmp: '₹450', gmpVal: 450, size: '₹25,000 Cr', sizeVal: 25000 },
    { name: 'Bajaj Housing Finance', status: 'Open', open: 'Jun 05, 2026', close: 'Jun 07, 2026', gmp: '₹85', gmpVal: 85, size: '₹6,560 Cr', sizeVal: 6560 },
    { name: 'Aadhar Housing Finance', status: 'Closed', open: 'May 08, 2026', close: 'May 10, 2026', gmp: '₹15', gmpVal: 15, size: '₹3,000 Cr', sizeVal: 3000 },
    { name: 'Indegene Ltd.', status: 'Closed', open: 'May 06, 2026', close: 'May 08, 2026', gmp: '₹260', gmpVal: 260, size: '₹1,842 Cr', sizeVal: 1842 },
    { name: 'Go Digit General Insurance', status: 'Closed', open: 'May 15, 2026', close: 'May 17, 2026', gmp: '₹45', gmpVal: 45, size: '₹2,614 Cr', sizeVal: 2614 },
  ];

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'gmpVal' | 'sizeVal'>('gmpVal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'gmpVal' | 'sizeVal') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredIpos = filterStatus === 'All'
    ? ipos
    : ipos.filter((i) => i.status === filterStatus);

  const sortedIpos = [...filteredIpos].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }
    return sortOrder === 'desc' ? (valB as number) - (valA as number) : (valA as number) - (valB as number);
  });

  const statuses = ['All', 'Open', 'Upcoming', 'Closed'];

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              background: filterStatus === s ? 'var(--primary)' : 'var(--secondary)',
              color: filterStatus === s ? '#fff' : 'var(--text-normal)',
              border: '1px solid var(--glass-border)',
              padding: '10px 20px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== s) e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== s) e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--secondary)' }}>
              <th 
                onClick={() => handleSort('name')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                Company Name {sortBy === 'name' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Open Date</th>
              <th style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700 }}>Close Date</th>
              
              <th 
                onClick={() => handleSort('gmpVal')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                Est. GMP {sortBy === 'gmpVal' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>

              <th 
                onClick={() => handleSort('sizeVal')} 
                style={{ padding: '18px 24px', color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer' }}
              >
                Issue Size {sortBy === 'sizeVal' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedIpos.map((ipo, idx) => (
              <tr 
                key={idx} 
                style={{ 
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--foreground)' }}>{ipo.name}</td>
                <td style={{ padding: '18px 24px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: ipo.status === 'Open' ? 'rgba(16, 185, 129, 0.15)' : ipo.status === 'Closed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: ipo.status === 'Open' ? 'var(--accent)' : ipo.status === 'Closed' ? '#ef4444' : 'var(--primary)'
                  }}>
                    {ipo.status}
                  </span>
                </td>
                <td style={{ padding: '18px 24px', color: 'var(--text-normal)' }}>{ipo.open}</td>
                <td style={{ padding: '18px 24px', color: 'var(--text-normal)' }}>{ipo.close}</td>
                <td style={{ padding: '18px 24px', color: 'var(--accent)', fontWeight: 700 }}>{ipo.gmp}</td>
                <td style={{ padding: '18px 24px', color: 'var(--text-normal)' }}>{ipo.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
