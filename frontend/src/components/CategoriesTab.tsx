import React from 'react';
import Plot from 'react-plotly.js';
import type { CategoriePerf } from '../types';

interface CategoriesTabProps {
  categories: CategoriePerf[];
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ categories }) => {
  return (
    <div className="chart-wrapper" style={{height: '100%'}}>
      <Plot
        data={[
          {
            type: 'pie',
            labels: categories.map(c => c.categorie),
            values: categories.map(c => c.ca),
            textinfo: 'label+percent',
            textposition: 'inside',
            hole: 0.7, // Ultra thin donut
            marker: {
              colors: ['#1199fa', '#00d893', '#ff4d52', '#f0b90b', '#7d5fff']
            },
            textfont: { color: '#ffffff', family: 'JetBrains Mono, monospace', size: 14 },
            hoverinfo: 'label+value+percent'
          }
        ]}
        layout={{
          title: { text: 'RÉPARTITION PAR CATÉGORIE', font: { color: '#ffffff', size: 14 } },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          legend: { 
            font: { color: '#b2b4b8' },
            orientation: 'h',
            y: -0.1
          },
          margin: { t: 40, b: 20, l: 20, r: 20 },
          height: 350,
          annotations: [{ 
            text: 'VENTES', 
            showarrow: false, 
            font: { size: 14, color: '#text-secondary' } 
          }]
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
