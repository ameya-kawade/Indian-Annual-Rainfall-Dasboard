import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';

const AnalyticsView = ({ subTrend, nationalTrend, subName }) => {
  // Combine data for comparison chart
  const comparisonData = subTrend.map(d => {
    const national = nationalTrend.find(n => n.year === d.year);
    return {
      year: d.year,
      [subName]: d.rainfall,
      "National Average": national ? parseFloat(national.rainfall.toFixed(2)) : 0
    };
  });

  // Calculate histogram data (Distribution)
  const annualValues = subTrend.map(d => d.rainfall);
  const min = Math.floor(Math.min(...annualValues) / 500) * 500;
  const max = Math.ceil(Math.max(...annualValues) / 500) * 500;
  const bins = [];
  for (let i = min; i < max; i += 500) {
    const count = annualValues.filter(v => v >= i && v < i + 500).length;
    bins.push({ range: `${i}-${i + 500}`, count });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="chart-card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Regional vs. National Comparison</h3>
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="mm" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey={subName} stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="National Average" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Rainfall Distribution (Frequency)</h3>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" fill="var(--primary-light)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Number of years falling within specific rainfall ranges (in mm)
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;
