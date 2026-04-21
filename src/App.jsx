import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  CloudRain, 
  Database, 
  LayoutDashboard, 
  MapPin, 
  Sigma,
  TrendingUp
} from 'lucide-react';
import { processRainfallData, getSubdivisionData, performPTest, getNationalAverage } from './utils/dataProcessor';
import StatsCard from './components/StatsCard';
import RainfallCharts from './components/RainfallCharts';
import PTestExplanation from './components/PTestExplanation';
import AnalyticsView from './components/AnalyticsView';
import DataTable from './components/DataTable';

const App = () => {
  const [data, setData] = useState(null);
  const [subdivisions, setSubdivisions] = useState([]);
  const [selectedSub, setSelectedSub] = useState('');
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pTestResult, setPTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [nationalTrend, setNationalTrend] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}rainfall in india 1901-2015.csv`);
        const csv = await response.text();
        
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const processed = processRainfallData(results.data);
            const national = getNationalAverage(results.data);
            setData(results.data);
            setSubdivisions(processed.subdivisions);
            setNationalTrend(national);
            if (processed.subdivisions.length > 0) {
              setSelectedSub(processed.subdivisions[0]);
            }
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data && selectedSub) {
      const subInfo = getSubdivisionData(data, selectedSub);
      setSubData(subInfo);
      
      // Perform p-test on annual rainfall values
      const annualValues = subInfo.annualTrend.map(d => d.rainfall);
      const test = performPTest(annualValues, 1200); // Testing against 1200mm threshold
      setPTestResult(test);
    }
  }, [data, selectedSub]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
        <TrendingUp className="animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <CloudRain size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>HydroStat</h2>
        </div>

        <div className="select-group">
          <label className="select-label">Subdivision</label>
          <select 
            className="select-input"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
          >
            {subdivisions.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('raw')}
            className={`nav-link ${activeTab === 'raw' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            <Database size={18} />
            Raw Data
          </button>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dataset Period</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>1901 — 2015</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>{selectedSub}</h1>
            <p>
              {activeTab === 'overview' && 'Regional rainfall patterns and statistical analysis'}
              {activeTab === 'analytics' && 'In-depth statistical insights and comparisons'}
              {activeTab === 'raw' && 'Detailed record-level data exploration'}
            </p>
          </div>
          <div className="badge">
            <MapPin size={14} style={{ marginRight: '4px' }} />
            India
          </div>
        </header>

        {subData && activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatsCard label="Mean Rainfall" value={subData.stats.mean} icon={Sigma} />
              <StatsCard label="Median" value={subData.stats.median} icon={Calendar} />
              <StatsCard label="Standard Dev." value={subData.stats.stdDev} />
              <StatsCard label="Variance" value={subData.stats.variance} unit="mm²" />
              <StatsCard label="Range" value={subData.stats.range} />
              <StatsCard label="IQR" value={subData.stats.iqr} />
              <StatsCard label="Q1 (25th)" value={subData.stats.q1} />
              <StatsCard label="Q3 (75th)" value={subData.stats.q3} />
            </div>

            {/* Charts */}
            <RainfallCharts 
              trendData={subData.annualTrend} 
              monthlyData={subData.monthlyAverages} 
            />

            {/* P-Test Section */}
            <PTestExplanation result={pTestResult} />
          </>
        )}

        {subData && activeTab === 'analytics' && (
          <AnalyticsView 
            subTrend={subData.annualTrend} 
            nationalTrend={nationalTrend} 
            subName={selectedSub}
          />
        )}

        {data && activeTab === 'raw' && (
          <DataTable data={data} subName={selectedSub} />
        )}
        
        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Built for Rainfall Analytics © 2026
        </footer>
      </main>
    </div>
  );
};

export default App;
