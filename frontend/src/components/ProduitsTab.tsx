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
                color: produits.map((_, i) => `rgba(96, 165, 250, ${1 - i * 0.07})`),
                cornerradius: 4
              } as object,
              text: produits.map(p => String(p[critere])),
              textposition: 'auto',
              textfont: { color: '#ffffff', family: 'JetBrains Mono, monospace' }
            }
          ]}
          layout={{
            title: { text: `TOP 10 — ${labels[critere].toUpperCase()}`, font: { color: '#ffffff', family: 'Inter, sans-serif' } },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: { title: '', color: '#b2b4b8', gridcolor: 'rgba(255,255,255,0.06)', tickfont: { family: 'JetBrains Mono, monospace' }, automargin: false },
            yaxis: { color: '#ffffff', gridcolor: 'rgba(255,255,255,0.06)', tickfont: { family: 'Inter, sans-serif' }, automargin: false },
            height: 400,
            margin: { l: 280, r: 20, t: 40, b: 40 },
            uirevision: 'produits-top'
          }}
          useResizeHandler
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>
      
      <h3 style={{ marginTop: '30px' }}>Rentabilité Produit</h3>
      
      {marge.top.length > 0 && marge.bottom.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="chart-wrapper">
            <Plot
              data={[
                {
                  type: 'bar',
                  x: marge.top.map(p => p.marge_pct),
                  y: marge.top.map(p => p.produit),
                  orientation: 'h',
                  marker: { color: '#34d399', cornerradius: 4 } as object,
                  text: marge.top.map(p => `${p.marge_pct.toFixed(2)}%`),
                  textposition: 'auto',
                  textfont: { family: 'JetBrains Mono, monospace' }
                }
              ]}
              layout={{
                title: { text: 'MEILLEURES MARGES', font: { color: '#34d399', family: 'Inter, sans-serif' } },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { title: '', color: '#b2b4b8', gridcolor: 'rgba(255,255,255,0.06)', tickfont: { family: 'JetBrains Mono, monospace' } },
                yaxis: { color: '#ffffff', tickfont: { family: 'Inter, sans-serif' }, automargin: true },
                height: 350,
                margin: { l: 20, t: 40 },
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
                  type: 'bar',
                  x: marge.bottom.map(p => p.marge_pct),
                  y: marge.bottom.map(p => p.produit),
                  orientation: 'h',
                  marker: { color: '#fb7185', cornerradius: 4 } as object,
                  text: marge.bottom.map(p => `${p.marge_pct.toFixed(2)}%`),
                  textposition: 'auto'
                }
              ]}
              layout={{
                title: { text: 'FAIBLES MARGES', font: { color: '#ff4d52' } },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { title: '', color: '#b2b4b8', gridcolor: 'rgba(255,255,255,0.06)' },
                yaxis: { color: '#ffffff', automargin: true },
                height: 350,
                margin: { l: 20, t: 40 },
                transition: { duration: 500, easing: 'cubic-in-out' }
              }}
              useResizeHandler
          config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
