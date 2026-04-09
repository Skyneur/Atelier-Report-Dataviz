import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ComparaisonData, FideliteClients, MargeProduits } from '../types';
import { staggerContainer, fadeUpItem } from '../animations';
import { InfoTooltip } from './InfoTooltip';

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
        Indicateurs Clés
      </h3>

      <motion.div
        style={{display:'flex', flexDirection:'column', gap:'24px'}}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUpItem} style={{display:'flex', gap:'16px', alignItems:'start'}}>
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
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px', display:'flex', alignItems:'center', gap:'6px'}}>
              Tendance Globale
              <InfoTooltip text={evolPct > 0 ? `Le CA progresse de +${evolPct}% vs période précédente. Cette dynamique positive suggère d'accélérer les investissements sur les catégories en tête de croissance.` : `Recul de ${Math.abs(evolPct)}% vs période précédente. Identifier les segments en perte de vitesse et revoir la politique promotionnelle avant la prochaine période.`} />
            </div>
            <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{evolPct > 0 ? 'Croissance soutenue' : 'Correction du marché'}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
              {evolPct > 0 ? `Le CA progresse de +${evolPct}%` : `Recul de ${evolPct}% vs période préc.`}
            </div>
          </div>
        </motion.div>

        {marge.top.length > 0 && (
          <motion.div variants={fadeUpItem} style={{display:'flex', gap:'16px', alignItems:'start'}}>
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
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px', display:'flex', alignItems:'center', gap:'6px'}}>
                Top Asset
                <InfoTooltip text={`Ce produit affiche la meilleure marge du catalogue. Opportunité : le mettre en avant dans les recommandations et bundles pour maximiser la rentabilité globale.`} />
              </div>
              <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{marge.top[0].produit.substring(0, 20)}...</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
                Marge exceptionnelle de {marge.top[0].marge_pct.toFixed(1)}%
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={fadeUpItem} style={{display:'flex', gap:'16px', alignItems:'start'}}>
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
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px', display:'flex', alignItems:'center', gap:'6px'}}>
              Rétention
              <InfoTooltip text={fidelite.repeat_rate_pct < 30 ? `Niveau critique : moins d'1 client sur 3 commande à nouveau. Priorité : mettre en place un programme de fidélisation ou des relances post-achat ciblées.` : `Fidélisation saine : les clients reviennent régulièrement. Capitaliser sur cette base en proposant des offres exclusives pour augmenter leur panier moyen.`} />
            </div>
            <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{fidelite.repeat_rate_pct}% Repeat Rate</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
              {fidelite.repeat_rate_pct < 30 ? 'Niveau critique' : 'Fidélisation saine'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
