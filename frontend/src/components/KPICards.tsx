import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Wallet, ShoppingCart, BarChart3 } from 'lucide-react';
import type { KPIGlobaux } from '../types';
import { formaterEuro, formaterNombre, formaterPourcentage } from '../utils/formatters';
import { staggerContainer, fadeUpItem } from '../animations';

interface KPICardsProps {
  data: KPIGlobaux;
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const articlesParCommande = data.nb_commandes > 0
    ? (data.quantite_vendue / data.nb_commandes).toFixed(2)
    : '0.00';

  const IconWrapper = ({ children, color }: { children: React.ReactNode, color?: string }) => (
    <div style={{
      backgroundColor: color ? `${color}20` : 'rgba(255,255,255,0.05)',
      padding: '8px',
      borderRadius: '8px',
      color: color || 'var(--text-secondary)',
      display: 'inline-flex'
    }}>
      {children}
    </div>
  );

  return (
    <motion.div
      className="kpi-grid"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Chiffre d'Affaires</div>
          <IconWrapper color="var(--accent-primary)"><DollarSign size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterEuro(data.ca_total)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Profit Net</div>
          <IconWrapper color={data.profit_total >= 0 ? 'var(--success)' : 'var(--danger)'}>
            <Wallet size={18} />
          </IconWrapper>
        </div>
        <div className="value" style={{ color: data.profit_total >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formaterEuro(data.profit_total)}
        </div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Marge</div>
          <IconWrapper color="var(--accent-primary)"><TrendingUp size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterPourcentage(data.marge_moyenne)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Commandes</div>
          <IconWrapper><ShoppingBag size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterNombre(data.nb_commandes)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Clients Actifs</div>
          <IconWrapper><Users size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterNombre(data.nb_clients)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Flux Volume</div>
          <IconWrapper><Package size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterNombre(data.quantite_vendue)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Panier Moyen</div>
          <IconWrapper><ShoppingCart size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterEuro(data.panier_moyen)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Ratio Art/Cmd</div>
          <IconWrapper><BarChart3 size={18} /></IconWrapper>
        </div>
        <div className="value">{articlesParCommande}</div>
      </motion.div>
    </motion.div>
  );
};
