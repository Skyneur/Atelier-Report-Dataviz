import React from 'react';
import Plot from 'react-plotly.js';
import type { EvolutionTemporelle } from '../types';

interface TemporelTabProps {
  temporal: EvolutionTemporelle[];
  granularite: 'jour' | 'mois' | 'annee';
  onGranulariteChange: (g: 'jour' | 'mois' | 'annee') => void;
}

export const TemporelTab: React.FC<TemporelTabProps> = ({ temporal, granularite, onGranulariteChange }) => {
  // Calcul rapide de la moyenne mobile simple (SMA) sur 3 périodes pour lisser
  const sma = temporal.map((val, idx, arr) => {
    if (idx < 2) return val.ca;
    const sum = arr[idx].ca + arr[idx-1].ca + arr[idx-2].ca;
    return sum / 3;
  });

  return (
    <div className="chart-wrapper" style={{height: '100%'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3 style={{ margin:0, fontSize: '1rem' }}>Évolution des Performances</h3>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-primary)', padding: '4px', borderRadius: '8px' }}>
          {(['jour', 'mois', 'annee'] as const).map(g => (
            <button
              key={g}
              onClick={() => onGranulariteChange(g)}
              className={`tab ${granularite === g ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 12px', height: '28px' }}
            >
              {g === 'jour' ? '1J' : g === 'mois' ? '1M' : '1A'}
            </button>
          ))}
        </div>
      </div>
      
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'lines',
            name: 'CA',
            x: temporal.map(t => t.periode),
            y: temporal.map(t => t.ca),
            line: { color: '#1199fa', width: 2, shape: 'spline' },
            fill: 'tozeroy',
            fillcolor: 'rgba(17, 153, 250, 0.1)'
          },
          {
            type: 'scatter',
            mode: 'lines',
            name: 'Trend (SMA)',
            x: temporal.map(t => t.periode),
            y: sma,
            line: { color: 'rgba(255,255,255,0.2)', width: 1, dash: 'dot' },
            hoverinfo: 'skip'
          }
        ]}
        layout={{
          font: { family: 'Inter, sans-serif', color: '#ffffff' },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: { 
            title: '', 
            color: '#b2b4b8', 
            gridcolor: 'rgba(255,255,255,0.05)',
            showgrid: false,
            tickfont: { family: 'JetBrains Mono, monospace' }
          },
          yaxis: { 
            title: '', 
            color: '#b2b4b8', 
            gridcolor: 'rgba(255,255,255,0.05)',
            side: 'right', // Prix à droite comme sur les sites de trading
            tickfont: { family: 'JetBrains Mono, monospace' }
          },
          legend: { font: { family: 'Inter, sans-serif', color: '#ffffff' }, orientation: 'h', x: 0, y: 1 },
          margin: { l: 20, r: 50, t: 30, b: 30 },
          height: 350, // Fixed height for alignment
          hovermode: 'x unified'
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};