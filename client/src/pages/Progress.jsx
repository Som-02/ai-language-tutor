import { useEffect, useState } from 'react';
import { getProgress } from '../api/tutorApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Progress({ onBack }) {
  const [data, setData] = useState(null);

  useEffect(() => { getProgress().then(r => setData(r.data)); }, []);

  const s = {
    page:  { minHeight: '100vh', background: '#0f0f0f', padding: '2rem', color: '#fff' },
    back:  { background: 'none', border: 'none', color: '#7c6bff', fontSize: '14px', marginBottom: '1.5rem', cursor: 'pointer' },
    title: { fontSize: '24px', fontWeight: '600', marginBottom: '1.5rem' },
    grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' },
    card:  { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' },
    stat:  { fontSize: '32px', fontWeight: '700', color: '#7c6bff' },
    label: { fontSize: '12px', color: '#666', marginTop: '4px' },
    chart: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' },
  };

  if (!data) return <div style={{ ...s.page, color: '#666' }}>Loading progress...</div>;

  const chartData = {
    labels:   data.recentSessions.map((_, i) => `Session ${i + 1}`),
    datasets: [
      { label: 'Corrections', data: data.recentSessions.map(s => s.corrections),
        backgroundColor: '#ef4444aa', borderRadius: 4 },
      { label: 'New Words',   data: data.recentSessions.map(s => s.newWords),
        backgroundColor: '#7c6bffaa', borderRadius: 4 },
    ]
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>
      <p style={s.title}>Your Progress</p>

      <div style={s.grid}>
        {[
          { val: data.totalSessions,    label: 'Total sessions' },
          { val: data.totalCorrections, label: 'Grammar corrections' },
          { val: data.totalNewWords,    label: 'New words learned' },
          { val: data.reviewedCards,    label: 'Flashcards reviewed' },
        ].map((item, i) => (
          <div key={i} style={s.card}>
            <div style={s.stat}>{item.val}</div>
            <div style={s.label}>{item.label}</div>
          </div>
        ))}
      </div>

      {data.recentSessions.length > 0 && (
        <div style={s.chart}>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '1rem' }}>Last {data.recentSessions.length} sessions</p>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#888' } } },
            scales: { x: { ticks: { color: '#666' } }, y: { ticks: { color: '#666' } } } }} />
        </div>
      )}
    </div>
  );
}