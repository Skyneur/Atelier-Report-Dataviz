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
                  colorscale: [[0, '#0f2444'], [1, '#60a5fa']],
                  cornerradius: 4
                } as object,
                text: geo.map(g => `${(g.ca/1000).toFixed(0)}k`),
                textposition: 'outside',
                textfont: { color: '#b2b4b8' }
              }
            ]}
            layout={{
              title: { text: 'PERFORMANCE RÉGIONALE (CA)', font: { color: '#ffffff', family: 'Inter, sans-serif' } },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { color: '#b2b4b8', gridcolor: 'rgba(255,255,255,0.06)', tickfont: { family: 'Inter, sans-serif' } },
              yaxis: { color: '#b2b4b8', gridcolor: 'rgba(255,255,255,0.06)', tickfont: { family: 'JetBrains Mono, monospace' } },
              height: 400,
              transition: { duration: 500, easing: 'cubic-in-out' }
            }}
            useResizeHandler
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
                marker: { colors: ['#60a5fa', '#34d399', '#fb7185', '#fbbf24'] }
              }
            ]}
            layout={{
              title: { text: 'RÉPARTITION CLIENTÈLE', font: { color: '#ffffff' } },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              legend: { font: { color: '#ffffff' } },
              height: 400,
              transition: { duration: 500, easing: 'cubic-in-out' },
              annotations: [{ text: 'TOTAL', showarrow: false, font: { size: 20, color: '#ffffff' } }]
            }}
            useResizeHandler
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
