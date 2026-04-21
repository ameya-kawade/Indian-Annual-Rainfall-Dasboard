import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const DataTable = ({ data, subName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter and format data
  const filteredData = data
    .filter(row => row.SUBDIVISION === subName)
    .filter(row => row.YEAR.toString().includes(searchTerm))
    .sort((a, b) => b.YEAR - a.YEAR);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const downloadCSV = () => {
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subName}_rainfall_data.csv`;
    a.click();
  };

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search year..." 
            className="select-input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button onClick={downloadCSV} className="nav-link" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Year</th>
              {months.map(m => <th key={m} style={{ padding: '1rem' }}>{m}</th>)}
              <th style={{ padding: '1rem' }}>Annual</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{row.YEAR}</td>
                {months.map(m => <td key={m} style={{ padding: '1rem' }}>{parseFloat(row[m]).toFixed(1)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{parseFloat(row.ANNUAL).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Showing {currentData.length} of {filteredData.length} records
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'white', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
            {currentPage} / {totalPages || 1}
          </span>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'white', borderRadius: '4px', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
