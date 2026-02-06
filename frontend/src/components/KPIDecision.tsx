import React from 'react';
import { TrendingUp, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ComparaisonData, FideliteClients, MargeProduits } from '../types';

interface KPIDecisionProps {
  comparaison: ComparaisonData;
  fidelite: FideliteClients;
  marge: MargeProduits;
}

export const KPIDecision: React.FC<KPIDecisionProps> = ({ comparaison, fidelite, marge }) => {
  const evolution = comparaison.latest;
  const evolPct = evolution.evolution_pct;
  
  return (
    <div className="kpi-card" style={{height: '100%'}}>
      <h3 style={{fontSize:'1rem', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
        <span style={{width:'8px', height:'8px', background:'var(--accent-primary)', borderRadius:'50%', display:'inline-block'}}></span>
        Market Insights
      </h3>
      
      <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
        {/* Trend Item */}
        <div style={{display:'flex', gap:'16px', alignItems:'start'}}>
          <div style={{
            background: evolPct >= 0 ? 'rgba(0, 216, 147, 0.1)' : 'rgba(255, 77, 82, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            color: evolPct >= 0 ? 'var(--success)' : 'var(--danger)',
            minWidth: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {evolPct >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          </div>
          <div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px'}}>Tendance Globale</div>
            <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{evolPct > 0 ? 'Croissance soutenue' : 'Correction du marché'}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
              {evolPct > 0 ? `Le CA progresse de +${evolPct}%` : `Recul de ${evolPct}% vs période préc.`}
            </div>
          </div>
        </div>

        {/* Product Item */}
        {marge.top.length > 0 && (
          <div style={{display:'flex', gap:'16px', alignItems:'start'}}>
            <div style={{
              background: 'rgba(17, 153, 250, 0.1)',
              padding: '10px',
              borderRadius: '12px',
              color: 'var(--info)',
              minWidth: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={20} />
            </div>
            <div>
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px'}}>Top Asset</div>
              <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{marge.top[0].produit.substring(0, 20)}...</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
                Marge exceptionnelle de {marge.top[0].marge_pct.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Retention Item */}
        <div style={{display:'flex', gap:'16px', alignItems:'start'}}>
          <div style={{
            background: fidelite.repeat_rate_pct < 30 ? 'rgba(255, 77, 82, 0.1)' : 'rgba(0, 216, 147, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            color: fidelite.repeat_rate_pct < 30 ? 'var(--danger)' : 'var(--success)',
            minWidth: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {fidelite.repeat_rate_pct < 30 ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
          </div>
          <div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px'}}>Rétention</div>
            <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{fidelite.repeat_rate_pct}% Repeat Rate</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
              {fidelite.repeat_rate_pct < 30 ? 'Niveau critique' : 'Fidélisation saine'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};