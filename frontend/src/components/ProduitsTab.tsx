import React from 'react';
import Plot from 'react-plotly.js';
import type { ProduitTop, MargeProduits } from '../types';

interface ProduitsTabProps {
  produits: ProduitTop[];
  marge: MargeProduits;
  critere: 'ca' | 'profit' | 'quantite';
  onCritereChange: (critere: 'ca' | 'profit' | 'quantite') => void;
}

const labels: Record<string, string> = {
  ca: 'Chiffre d\'Affaires',
  profit: 'Profit / Pertes',
  quantite: 'Volume'
};

export const ProduitsTab: React.FC<ProduitsTabProps> = ({ produits, marge, critere, onCritereChange }) => {
  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        {(['ca', 'profit', 'quantite'] as const).map(c => (
          <button
            key={c}
            onClick={() => onCritereChange(c)}
            className={`tab ${critere === c ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            {labels[c]}
          </button>
        ))}
      </div>
      
      <div className="chart-wrapper">
        <Plot
          data={[
            {
              type: 'bar',
              x: produits.map(p => p[critere]),
              y: produits.map(p => p.produit),
              orientation: 'h',
              marker: {
                color: '#1199fa' // Crypto Blue
              },
              text: produits.map(p => String(p[critere])),
              textposition: 'auto',
              textfont: { color: '#ffffff', family: 'JetBrains Mono, monospace' }
            }
          ]}
          layout={{
            title: { text: `TOP 10 PERFORMERS (${labels[critere].toUpperCase()})`, font: { color: '#ffffff', family: 'Inter, sans-serif' } },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: { title: '', color: '#b2b4b8', gridcolor: '#262b33', tickfont: { family: 'JetBrains Mono, monospace' } },
            yaxis: { automargin: true, color: '#ffffff', gridcolor: '#262b33', tickfont: { family: 'Inter, sans-serif' } },
            height: 400,
            margin: { l: 200, r: 20, t: 40, b: 40 }
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>
      
      <h3 style={{ marginTop: '30px' }}>Rentabilité Produit</h3>
      
      {marge.top.length > 0 && marge.bottom.length > 0 && (
        <div className="grid-2">
          <div className="chart-wrapper">
            <Plot
              data={[
                {
                  type: 'bar',
                  x: marge.top.map(p => p.marge_pct),
                  y: marge.top.map(p => p.produit),
                  orientation: 'h',
                  marker: { color: '#00d893' }, // Success green
                  text: marge.top.map(p => `${p.marge_pct.toFixed(2)}%`),
                  textposition: 'auto',
                  textfont: { family: 'JetBrains Mono, monospace' }
                }
              ]}
              layout={{
                title: { text: 'TOP MARGES', font: { color: '#00d893', family: 'Inter, sans-serif' } },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { title: '', color: '#b2b4b8', gridcolor: '#262b33', tickfont: { family: 'JetBrains Mono, monospace' } },
                yaxis: { automargin: true, color: '#ffffff', tickfont: { family: 'Inter, sans-serif' } },
                height: 350,
                margin: { l: 150, t: 40 }
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="chart-wrapper">
            <Plot
              data={[
                {
                  type: 'bar',
                  x: marge.bottom.map(p => p.marge_pct),
                  y: marge.bottom.map(p => p.produit),
                  orientation: 'h',
                  marker: { color: '#ff4d52' }, // Danger red
                  text: marge.bottom.map(p => `${p.marge_pct.toFixed(2)}%`),
                  textposition: 'auto'
                }
              ]}
              layout={{
                title: { text: 'FAIBLES MARGES', font: { color: '#ff4d52' } },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { title: '', color: '#b2b4b8', gridcolor: '#262b33' },
                yaxis: { automargin: true, color: '#ffffff' },
                height: 350,
                margin: { l: 150, t: 40 }
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
