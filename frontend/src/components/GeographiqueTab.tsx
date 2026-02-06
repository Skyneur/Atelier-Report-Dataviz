import React from 'react';
import Plot from 'react-plotly.js';
import type { PerformanceGeo } from '../types';

interface GeographiqueTabProps {
  geo: PerformanceGeo[];
}

export const GeographiqueTab: React.FC<GeographiqueTabProps> = ({ geo }) => {
  return (
    <div>
      <div className="grid-2">
        <div className="chart-wrapper">
          <Plot
            data={[
              {
                type: 'bar',
                x: geo.map(g => g.region),
                y: geo.map(g => g.ca),
                marker: {
                  color: geo.map(g => g.ca),
                  colorscale: [[0, '#0b1426'], [1, '#1199fa']] // Dark to Blue
                },
                text: geo.map(g => `${(g.ca/1000).toFixed(0)}k`),
                textposition: 'outside',
                textfont: { color: '#b2b4b8' }
              }
            ]}
            layout={{
              title: { text: 'PERFORMANCE RÉGIONALE (CA)', font: { color: '#ffffff', family: 'Inter, sans-serif' } },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { color: '#b2b4b8', gridcolor: '#262b33', tickfont: { family: 'Inter, sans-serif' } },
              yaxis: { color: '#b2b4b8', gridcolor: '#262b33', tickfont: { family: 'JetBrains Mono, monospace' } },
              height: 400
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>
        
        <div className="chart-wrapper">
          <Plot
            data={[
              {
                type: 'pie',
                labels: geo.map(g => g.region),
                values: geo.map(g => g.nb_clients),
                textinfo: 'percent',
                textposition: 'inside',
                hole: 0.6, // Donut styled like crypto portfolio
                marker: { colors: ['#1199fa', '#00d893', '#ff4d52', '#f0b90b'] }
              }
            ]}
            layout={{
              title: { text: 'RÉPARTITION CLIENTÈLE', font: { color: '#ffffff' } },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              legend: { font: { color: '#ffffff' } },
              height: 400,
              annotations: [{ text: 'TOTAL', showarrow: false, font: { size: 20, color: '#ffffff' } }]
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
